import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import Loading from "../../../../../components/Loading/Loading";
import socket from "../../../../../utils/Socket/socket.utils";
import socketEmitters from "../../../../../constants/types/emitters";

const BubbleContainer = ({ msg, orientation = "left", isSendingProp }: { msg: string; orientation: "left" | "right"; isSendingProp?: boolean; }) => {
    const [isMsgSending, setIsMsgSending] = useState(false);
    const [hasEmitterInit, setHasEmitterInit] = useState(false);

    useEffect(() => {
        setIsMsgSending(isSendingProp);
    }, [isSendingProp]);

    useEffect(() => {
        if (isSendingProp && !hasEmitterInit) {
            socket.on(socketEmitters.RECEIVE_MSG_RESPONSE, (message) => {
                setHasEmitterInit(true);
                if (message === msg) {
                    setIsMsgSending(false)
                    socket.off(socketEmitters.RECEIVE_MSG_RESPONSE)
                }
            });
        }
    }, [isSendingProp]);

    const classType = orientation === "left" ?
        "flex items-center mt-4 break-words bg-gray-200 w-fit py-2 px-2 rounded-tl-lg rounded-tr-lg rounded-br-lg max-w-xs sm:max-w-lg lg:max-w-xl" :
        "pl-5 flex items-center mt-4 break-words bg-sky-500 w-fit py-2 px-2 rounded-tl-lg rounded-tr-lg rounded-bl-lg max-w-xs sm:max-w-lg lg:max-w-xl";


    const Status = isMsgSending ? (
        <div style={{ transform: "scale(0.3)", color: "#fff" }} className="relative top-1 left-1 h-10 w-10 flex justify-center items-center">
            <Loading style={{ color: "#fff" }} responsive />
        </div>
    ) : (
        <div style={{ transform: "scale(0.6)", color: "#fff" }} className="h-10 w-10 flex justify-end items-end">
            <DoneIcon color="inherit" />
        </div>
    );

    return (
        <div className={orientation === "right" ? "flex justify-end" : ""}>
            <div className={classType}>
                <Typography
                    sx={{

                        wordBreak: "break-word"
                    }}
                    variant="body1"
                    color={orientation === "right" ? "#fff" : "inherit"}
                >
                    {msg}
                </Typography>
                {
                    orientation === "right" && Status
                }
            </div>
        </div >
    )
};

export default BubbleContainer;