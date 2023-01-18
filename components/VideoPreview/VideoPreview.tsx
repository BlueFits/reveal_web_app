import { MutableRefObject, useEffect, useState } from "react";
import { Container, Avatar, Typography } from "@mui/material"

interface IVideoPreview {
    username: string;
    videoRef?: MutableRefObject<HTMLVideoElement>;
    isMuted?: boolean;
    showAvatar?: boolean;
}

const avatarSimple = {
    bg: [
        "bg-green-500",
        "bg-emerald-400",
        "bg-teal-600",
        "bg-cyan-400",
        "bg-violet-600",
        "bg-pink-400",
        "bg-rose-600",
    ],
    display: [
        "=^.^=",
        "(=◑ᆺ◐=)",
        "(￣▼￣)",
        ":-B",
        "*8-I",
        "=)",
        "^-^",
        "!_!",
        "B^)",
        "(˘⌣˘)",
        "(^_^)",
    ],
};

const VideoPreview: React.FC<IVideoPreview> = ({ username, videoRef = null, isMuted = true, showAvatar = false }) => {

    const [localRef, setLocalRef] = useState(videoRef);
    const [bgDisplay, setBgDisplay] = useState<string>(avatarSimple.bg[Math.floor(Math.random() * avatarSimple.bg.length)]);
    const [colorDisplay, setColorDisplay] = useState<string>(avatarSimple.display[Math.floor(Math.random() * avatarSimple.display.length)]);

    useEffect(() => {
        setLocalRef(videoRef)
    }, [videoRef, showAvatar]);

    return (
        <Container disableGutters className="flex-1 relative overflow-hidden">
            <div className="p-2 absolute bg-black/50 w-2/4 flex rounded-full items-center" style={{ top: 30, left: 10 }}>
                <Avatar alt={`${username.toLocaleUpperCase()} avatar`} src="/static/images/avatar/1.jpg" sx={{ marginRight: 3 }} />
                <p className="text-white">{username}</p>
            </div>
            {
                showAvatar &&
                <div className={`${bgDisplay} h-full w-full flex items-center justify-center`}>
                    <Typography variant="h1" color={"#fff"}>
                        {colorDisplay}
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