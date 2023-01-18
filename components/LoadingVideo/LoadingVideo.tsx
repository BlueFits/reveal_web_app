import { Container, CircularProgress } from "@mui/material"

const LoadingVideo: React.FC<{}> = () => {
    return (
        <Container disableGutters sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="bg-black flex-1 relative overflow-hidden">
            <CircularProgress color="primary" />
        </Container>
    );
};

export default LoadingVideo;