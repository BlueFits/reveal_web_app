import { CircularProgress } from "@mui/material";

const Loading = ({ responsive = false, ...other }) => {
    return (
        <div className={`${responsive ? "w-full h-full" : "w-screen h-screen"} flex justify-center items-center`}>
            <CircularProgress {...other} color="secondary" />
        </div>
    );
};

export default Loading;