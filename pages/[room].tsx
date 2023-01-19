import { useEffect, useRef } from "react";
import socket from "../config/Socket";
// import { v4 as uuidv4  } from "uuid";
import Peer from "peerjs";

export const getServerSideProps = async (context) => {
    try {
        return { props: { roomID: context.query.room } };
    } catch (err) {
        if (err) throw err;
    }
};

const room = ({ roomID }) => {

    const myVideo = useRef<HTMLVideoElement | null>();
    const userVideo = useRef<HTMLVideoElement | null>();

    useEffect(() => {

        const addVideoStream = (vidRefCurr, stream) => {
            if (!vidRefCurr) return;
            vidRefCurr.srcObject = stream;
        };

        const fn = async () => {
            const PeerJs = (await import('peerjs')).default;
            // set it to state here
            const myPeer = new PeerJs(undefined, {
                host: "/",
                port: 3001
            })

            const peers = {}

            const ms = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            addVideoStream(myVideo.current, ms);

            myPeer.on("call", call => {
                call.answer(ms);
                call.on("stream", (currStream) => {
                    addVideoStream(userVideo.current, currStream);
                });
            })

            socket.on("user-connected", userID => {
                console.log("User connected", userID);
                connectToNewUser(userID, ms);
            });


            myPeer.on("open", (id) => {
                socket.emit("join-room", roomID, id);
            });

            const connectToNewUser = (userID, stream) => {
                console.log("calling", userID);
                const call = myPeer.call(userID, stream);
                call.on("stream", (userVideoStream) => {
                    console.log("got stream from other user");
                    addVideoStream(userVideo.current, userVideoStream);
                });
                call.on("close", () => {
                    userVideo.current.remove();
                });
                peers[userID] = call
            };
        }
        fn()
    }, [myVideo, userVideo, roomID]);

    return (
        <div>
            <video
                autoPlay
                muted={true}
                ref={myVideo}
            />
            <video
                autoPlay
                ref={userVideo}
            />
        </div>
    )
};

export default room;