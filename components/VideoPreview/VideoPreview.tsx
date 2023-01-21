import { MutableRefObject, useEffect, useState } from "react";
import { Container, Avatar, Typography, CircularProgress } from "@mui/material"
import { IUserReducer } from "../../services/modules/userSlice";
import { apiTempUser } from "../../services/modules/otherUserSlice";

interface IVideoPreview {
    user: IUserReducer | apiTempUser;
    videoRef?: MutableRefObject<HTMLVideoElement>;
    isMuted?: boolean;
    showAvatar?: boolean;
}


const VideoPreview: React.FC<IVideoPreview> = ({ user, videoRef = null, isMuted = true, showAvatar = true }) => {
    const [localRef, setLocalRef] = useState(videoRef);
    const { username, avatar } = user;
    useEffect(() => {
        console.log("Video ref changed", videoRef.current);
        setLocalRef(videoRef)
    }, [videoRef.current]);
    return (
        <Container sx={{ backgroundColor: "#000" }} disableGutters className="flex-1 relative overflow-hidden">
            <div className="p-2 absolute bg-black/50 w-2/4 flex rounded-full items-center" style={{ top: 30, left: 10 }}>
                <Avatar alt={`${username && username.toLocaleUpperCase()} avatar`} src="/static/images/avatar/1.jpg" sx={{ marginRight: 3 }} />
                <p className="text-white">{username}</p>
            </div>
            {
                !user.username &&
                <div style={{ right: "50%", top: "50%" }} className="absolute">
                    <CircularProgress color="primary" />
                </div>
            }
            {
                showAvatar &&
                <div style={{ backgroundColor: avatar.bg }} className={`h-full w-full flex items-center justify-center`}>
                    <Typography variant="h1" color={"#fff"}>
                        {avatar.display}
                    </Typography>
                </div>
            }
            <video
                style={{ background: "black", height: "100%", width: "100%", objectFit: "cover" }}
                playsInline
                muted={isMuted}
                autoPlay
                ref={localRef}
            />
        </Container>
    );
};

export default VideoPreview;