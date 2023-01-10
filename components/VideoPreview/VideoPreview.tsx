import { Container, Avatar } from "@mui/material"

const VideoPreview = () => {
    return (
        <Container disableGutters className="flex-1 relative">
            <div className="p-2 absolute bg-black/50 w-2/4 flex rounded-full items-center" style={{ top: 30, left: 10 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ marginRight: 3 }} />
                <p className="text-white">Demarcus Demeteris</p>
            </div>
            <video
                style={{ background: "black", height: "100%", width: "100%" }}
                playsInline
                muted
                autoPlay
            />
        </Container>
    );
};

export default VideoPreview;