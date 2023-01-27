import { CircularProgress } from "@mui/material";

const Loading = () => {
    return (
        <div className="w-scren h-screen flex justify-center items-center ">
            <CircularProgress style={{ color: "#9b59b6" }} color="inherit" />
        </div>
    );
};

export default Loading;