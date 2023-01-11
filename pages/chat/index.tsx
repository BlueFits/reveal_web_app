import { useEffect, useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, setIsReady } from "../../services/modules/userSlice";
import { gen25TempUserPool, ITempUserPool } from "../../services/modules/tempUserPoolSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SocketContext, ISocketContextValues } from '../../contexts/SocketContext/SocketContext'

const Index = () => {
    const context: ISocketContextValues = useContext(SocketContext);
    const router = useRouter();
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const tempUserPoolReducer: ITempUserPool = useSelector((state: IReducer) => state.tempUserPool);

    //Initial Sanity Check for for proper redux setup
    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            console.log("Going back", userReducer);
            router.push("/");
            return;
        } else {
            if (!context.isReady) {
                dispatch(setIsReady(true))
                console.log("reducer file", userReducer);
            }
        }
    }, [context.isReady]);

    useEffect(() => {
        if (userReducer.isReady && userReducer.preference.length > 0) {
            console.log("calling dispatch");
            dispatch(gen25TempUserPool(userReducer.preference));
        }
    }, [userReducer]);

    useEffect(() => {
        console.log("User Pool", tempUserPoolReducer);
        const randomIndex = Math.floor(Math.random() * (tempUserPoolReducer.tempUsers.length));
        const userToCall = tempUserPoolReducer.tempUsers[randomIndex]
        if (userToCall && context.stream) {
            context.callUser(userToCall.socketID)
        }
    }, [tempUserPoolReducer, context.stream]);

    useEffect(() => {
        if (context.call && context.call.isReceivedCall && !context.callAccepted) {
            console.log("context call changed", context);
            context.answerCall();
        }
    }, [context.call]);

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    return !userReducer.username ? (
        <Typography>Invalid Page Redirecting...</Typography>
    ) : (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            {
                context.callAccepted && !context.callEnded &&
                <VideoPreview
                    isMuted={false}
                    videoRef={context.userVideo}
                    username={"test"}
                />
            }
            <VideoPreview
                videoRef={context && context.myVid}
                username={userReducer.username}
            />
            <Container className="absolute flex flex-col bottom-5">
                <ButtonContainer>
                    <Button sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Button style={{ backgroundColor: "#0971f1", color: "#fff", width: 100, borderRadius: 9999 }} size="large" variant="contained">Reveal</Button>
                </ButtonContainer>
                <div className="flex justify-between">
                    <Button sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button style={{ backgroundColor: "green", color: "#fff", width: 100, borderRadius: 9999 }} size="large" variant="contained">Match</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;