import { useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, setIsReady } from "../../services/modules/userSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import { useRouter } from "next/router";
import { useContext, MutableRefObject } from "react";
import { SocketContext, ISocketContextValues } from '../../contexts/SocketContext/SocketContext'

const Index = () => {
    const context: ISocketContextValues = useContext(SocketContext);
    const router = useRouter();
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);

    //Initial Sanity Check for for proper redux setup
    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            router.push("/");
            return;
        }
        dispatch(setIsReady(true))
        console.log(context && context.myVid);
        console.log("reducer file", userReducer);
    }, [context, userReducer]);

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
                username={"test"}
            />
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