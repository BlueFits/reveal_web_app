import { useEffect, useState, MutableRefObject, useRef, useCallback } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, createTempUser } from "../../services/modules/userSlice";
import { genTempUser, apiTempUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";
import { joinRoom, setupMediaStream } from "../../utils/videoCall.util";
import socket from "../../config/Socket";
import { tempUserStatus } from "../../server/tempUser/dto/create.tempUser.dto";

import { findRoom, IRoomReducer, createRoom, removeRoom } from "../../services/modules/roomSlice";
import { callUserData } from "../../constants/callTypes";

const Index = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const otherUserReducer: apiTempUser = useSelector((state: IReducer) => state.otherUser);
    const roomReducer: IRoomReducer = useSelector((state: IReducer) => state.room);

    //Video Call Shtuff
    const [stream, setStream] = useState<MediaProvider>();
    const [userStream, setUserStream] = useState(null);

    const [initSetupRan, setInitSetupRan] = useState(false);

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();

    const peerCall: Peer = useRef();
    const peerAnswer: Peer = useRef();

    //Camera Setup
    useEffect(() => {
        const setupWebCam = async () => {
            if (!stream) {
                await setupMediaStream(setStream);
            } else {
                const videoCurr = myVid.current;
                if (!videoCurr) return;
                const video = videoCurr;
                if (!video.srcObject) {
                    video.srcObject = stream;
                }
            }
        }
        setupWebCam();
    }, [stream]);

    /* Check for existing rooms */

    const createRoomExec = async () => {
        const roomData = await dispatch(createRoom(userReducer.preference));
        console.log("Created room id ", roomData.payload._id);
        joinRoom(roomData.payload._id, userReducer.socketID);
        socket.on(socketEmitters.USER_CONNECTED, (userID) => {
            console.log("New user connected ", userID);

            const peer1 = new Peer({
                initiator: true,
                trickle: false,
                stream
            });

            peerCall.current = peer1;

            peer1.on("signal", (signal) => {
                console.log("Sending signal");
                const data: callUserData = { toCallID: userID, signal, user: userReducer };
                socket.emit(socketEmitters.CALLUSER, data)
            })

            peer1.on("stream", (currStream) => {
                console.log("peer 1 picked up a stream");
                userVideo.current.srcObject = currStream;
            });
            peer1.on("error", (err) => {
                console.log("Connection error", err);
            })
            socket.on(socketEmitters.CALLACCEPTED, ({ signal }) => {
                peer1.signal(signal);
                socket.off(socketEmitters.CALLACCEPTED);
            });

            socket.off(socketEmitters.USER_CONNECTED)
        });
    }

    useEffect(() => {
        if (!initSetupRan && stream) {
            const findRoomThunk = async () => {
                console.log("user pref: ", userReducer.preference);
                const roomData: { payload: IRoomReducer } = await dispatch(findRoom(userReducer.preference));
                console.log("Joining ", roomData);
                if (roomData.payload && roomData.payload._id) {
                    joinRoom(roomData.payload._id, userReducer.socketID);
                } else {
                    /* no available rooms for database */
                    createRoomExec();
                }
            };
            findRoomThunk();
            setInitSetupRan(true);
        }
    }, [initSetupRan, stream]);

    useEffect(() => {
        if (stream) {
            socket.on(socketEmitters.ROOM_FULL, () => {
                /* room trying to join has reached max capacity */
                console.log("Room is full creating a new room");
                createRoomExec();
            })

            socket.on(socketEmitters.CALLUSER, ({ signal, user }: Partial<callUserData>) => {
                console.log("getting a connection from", user);
                const peer2 = new Peer({
                    trickle: false,
                    initiator: false,
                    stream,
                });
                peer2.on("signal", async (signal) => {
                    console.log("Sending delete request", roomReducer);
                    // await dispatch(removeRoom(roomReducer._id));
                    socket.emit(socketEmitters.ANSWER_CALL, { signal, socketID: user.socketID })
                })
                peer2.on("stream", (currStream) => {
                    console.log("Picked up a stream");
                    console.log("Curr stream", currStream);
                    console.log(userVideo);
                    setUserStream(currStream);
                })
                peer2.on("error", (err) => {
                    console.log("Connection error", err);
                })
                peer2.signal(signal);
            });
        }
    }, [stream]);

    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            window.location.href = "/";
        }
    }, [userReducer]);

    useEffect(() => {
        userVideo.current.srcObject = userStream;
    }, [userStream, userVideo]);

    const addMedia = (stream) => {
        console.log("My stream ", stream);
        myVid.current.srcObject = stream;
        peerCall.current.addStream(stream);
    };

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    const revealHandler = () => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(addMedia).catch(() => { })
    };

    return !userReducer.username ? (
        <Typography>Invalid Page Redirecting...</Typography>
    ) : (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            <VideoPreview
                isMuted={false}
                videoRef={userVideo}
                user={otherUserReducer}
                showAvatar={false}
            />
            <VideoPreview
                videoRef={myVid}
                user={userReducer}
                showAvatar={false}
            />
            <Container className="absolute flex flex-col bottom-5">
                {
                    false ?
                        <ButtonContainer>
                            <Button
                                onClick={() => alert("Will be implemented in a future release")}
                                style={{
                                    backgroundColor: "green",
                                    color: "#fff",
                                    width: 100,
                                    borderRadius: 9999
                                }}
                                size="large"
                                variant="contained"
                            >
                                Match
                            </Button>
                        </ButtonContainer> :
                        <ButtonContainer>
                            <Button
                                onClick={revealHandler}
                                disabled={false}
                                style={{
                                    backgroundColor: true ? "inherit" : "#0971f1",
                                    color: "#fff",
                                    width: 100,
                                    borderRadius: 9999
                                }}
                                size="large"
                                variant="contained"
                            >
                                {"reveal"}
                            </Button>
                        </ButtonContainer>
                }
                <div className="flex justify-between">
                    <Button onClick={() => window.location.href = "/"} sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button disabled={true} onClick={() => console.log("Not set")} sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;