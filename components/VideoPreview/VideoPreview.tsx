import { MutableRefObject, useEffect, useState } from "react";
import { Container, Avatar } from "@mui/material"

interface IVideoPreview {
    username: string;
    videoRef?: MutableRefObject<HTMLVideoElement>;
}

const VideoPreview: React.FC<IVideoPreview> = ({ username, videoRef = null }) => {

    const [localRef, setLocalRef] = useState(videoRef);

    useEffect(() => {
        console.log(`video reference for ${username}`, videoRef);
        setLocalRef(videoRef)
    }, [videoRef]);

    return (
        <Container disableGutters className="flex-1 relative">
            <div className="p-2 absolute bg-black/50 w-2/4 flex rounded-full items-center" style={{ top: 30, left: 10 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ marginRight: 3 }} />
                <p className="text-white">{username}</p>
            </div>
            <video
                style={{ background: "black", height: "100%", width: "100%", objectFit: "cover" }}
                playsInline
                muted
                autoPlay
                ref={localRef}
            />
        </Container>
    );
};

export default VideoPreview;