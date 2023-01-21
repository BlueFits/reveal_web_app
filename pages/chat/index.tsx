import { useEffect, useState, MutableRefObject, useRef, useCallback } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, createTempUser } from "../../services/modules/userSlice";
import { genTempUser, apiTempUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";
import { joinRoom } from "../../utils/videoCall.util";
import socket from "../../config/Socket";
import { tempUserStatus } from "../../server/tempUser/dto/create.tempUser.dto";

import { findRoom, IRoomReducer, createRoom } from "../../services/modules/roomSlice";

const Index = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const otherUserReducer: apiTempUser = useSelector((state: IReducer) => state.otherUser);
    const roomReducer: IRoomReducer = useSelector((state: IReducer) => state.room);

    //Video Call Shtuff
    const [stream, setStream] = useState<MediaProvider>();

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();

    const peer2Ref: Peer = useRef();

    //Camera Setup
    // useEffect(() => {
    //     const setupWebCam = async () => {
    //         if (!stream) {
    //             await setupMediaStream(setStream);
    //         } else {
    //             const videoCurr = myVid.current;
    //             if (!videoCurr) return;
    //             const video = videoCurr;
    //             if (!video.srcObject) {
    //                 video.srcObject = stream;
    //             }
    //         }
    //     }
    //     setupWebCam();
    // }, [stream]);

    /* Check for existing rooms */
    useEffect(() => {

        const createRoomExec = async () => {
            const roomData = await dispatch(createRoom(userReducer.preference));
            console.log("Created room id ", roomData.payload._id);
            joinRoom(roomData.payload._id, userReducer.socketID);
            socket.on(socketEmitters.USER_CONNECTED, (userID) => {
                console.log("New user connected ", userID);
                socket.off(socketEmitters.USER_CONNECTED)
            });
        }

        socket.on(socketEmitters.ROOM_FULL, () => {
            /* room trying to join has reached max capacity */
            console.log("Room is full creating a new room");
            createRoomExec();
        })


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
    }, []);

    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            window.location.href = "/";
        }
    }, [userReducer]);

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

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
                                onClick={() => console.log("niothiung")}
                                disabled={true}
                                style={{
                                    backgroundColor: true ? "inherit" : "#0971f1",
                                    color: "#fff",
                                    width: 100,
                                    borderRadius: 9999
                                }}
                                size="large"
                                variant="contained"
                            >
                                {"Not set"}
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