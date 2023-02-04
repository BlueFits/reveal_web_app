import { CircularProgress } from "@mui/material";

const Loading = ({ responsive = false }) => {
    return (
        <div className={`${responsive ? "w-full h-full" : "w-screen h-screen"} flex justify-center items-center`}>
            <CircularProgress color="secondary" />
        </div>
    );
};

export default Loading;