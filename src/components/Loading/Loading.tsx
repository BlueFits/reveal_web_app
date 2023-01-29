import { CircularProgress } from "@mui/material";

const Loading = () => {
    return (
        <div className="w-scren h-screen flex justify-center items-center ">
            <CircularProgress color="secondary" />
        </div>
    );
};

export default Loading;