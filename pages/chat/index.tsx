import { Container, Button } from "@mui/material"
import VideoPreview from "../../components/VideoPreview/VideoPreview";

const Index = () => {

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    return (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            <VideoPreview />
            <VideoPreview />
            <Container className="absolute flex flex-col bottom-10">
                <ButtonContainer>
                    <Button className="rounded-full" sx={{ width: 100 }} size="large" variant="outlined">Skip</Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Button className="rounded-full" style={{ backgroundColor: "#0971f1", color: "#fff", width: 100 }} size="large" variant="contained">Reveal</Button>
                </ButtonContainer>
                <div className="flex justify-between">
                    <Button className="rounded-full" size="large" variant="outlined">Leave</Button>
                    <Button className="rounded-full" style={{ backgroundColor: "green", color: "#fff", width: 100 }} size="large" variant="contained">Match</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;