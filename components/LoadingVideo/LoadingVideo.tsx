import { Container, CircularProgress } from "@mui/material"

const LoadingVideo: React.FC<{}> = () => {
    return (
        <Container disableGutters className="bg-black flex-1 relative overflow-hidden flex justify-center items-center">
            <CircularProgress color="primary" />
        </Container>
    );
};

export default LoadingVideo;