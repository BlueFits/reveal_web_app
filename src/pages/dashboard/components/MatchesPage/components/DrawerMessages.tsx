import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography, TextField } from "@mui/material";
import { CreateMessageDto, IMessageSingle } from "../../../../../../server/Messages/dto/messages.dto";
import { IUserReducer } from "../../../../../services/modules/User/userSlice";
import SendIcon from '@mui/icons-material/Send';
import socket from "../../../../../utils/Socket/socket.utils";
import socketEmitters, { ISendIDChat, ISendMsgChat } from "../../../../../constants/types/emitters";
import Loading from "../../../../../components/Loading/Loading";
import { useDispatch } from "react-redux";
import { sendMessage, pushMsg } from "../../../../../services/modules/Messages/messagesSlice";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BubbleContainer from "./BubbleContainer";

interface IDrawerMenu {
    open: boolean;
    onClose: any;
    user: IUserReducer;
    OtherUser?: IUserReducer;
    messageInfo: CreateMessageDto;
    pushToMsg: (msg: IMessageSingle) => void;
}

const DrawerMessages: React.FC<IDrawerMenu> = ({ open, onClose, user, OtherUser, messageInfo, pushToMsg }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [msg, setMsg] = useState<string>("");
    const [otherSocketID, setOtherSocketID] = useState<string>("");
    const [receiveMsg, setReceiveMsg] = useState<IMessageSingle>({
        message: null,
        sender: null,
    });
    const [isUserConnected, setIsUserConnected] = useState(false);
    const messagesEndRef = useRef(null)

    const scrollToBottom = ({ instant = false }: { instant?: boolean; } = {}) => {
        messagesEndRef.current?.scrollIntoView({ behavior: instant ? "auto" : "smooth" })
    }

    useEffect(() => {
        if (messagesEndRef.current) scrollToBottom();
    }, [messageInfo]);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                if (messagesEndRef.current) scrollToBottom({ instant: true });
                setIsLoading(false);
            }, 500);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            socket.on(socketEmitters.USER_CONNECTED_ROOM, (otherSocketID: string) => {
                setIsUserConnected(true);
                setOtherSocketID(otherSocketID);
                const data: ISendIDChat = {
                    userSocket: user.socketID,
                    otherUserSocket: otherSocketID,
                };
                socket.emit(socketEmitters.SEND_ID_CHAT, data);
            });
            socket.on(socketEmitters.RECEIVE_ID_CHAT, (otherSocketID: string) => {
                setOtherSocketID(otherSocketID);
            });
            socket.on(socketEmitters.RECEIVE_MSG_CHAT, (data: { message: IMessageSingle, other: string }) => {
                setReceiveMsg(data.message);
                socket.emit(socketEmitters.RECEIVE_MSG_RESPONSE, { otherSocketID: data.other, message: data.message.message });
            });
            socket.on(socketEmitters.CHAT_DISCONNECT, () => {
                console.log("Other user disonnected");
                setIsUserConnected(false);
            });
        }
    }, [open]);

    /* Created due to pushMsg Callback issue */
    useEffect(() => {
        if (receiveMsg.sender) {
            dispatch(pushMsg({ messageID: messageInfo._id, messageInstance: receiveMsg }));
            pushToMsg(receiveMsg);
        }
    }, [receiveMsg]);

    const sendHandler = async () => {
        try {

            if (msg === "") return;


            dispatch(sendMessage({ messageID: messageInfo._id, userID: user._id, msg })).payload;

            //Puts message for me
            const data: ISendMsgChat = {
                message: {
                    sender: user._id,
                    message: msg,
                },
                otherSocketID,
            };

            if (isUserConnected) data.message.isSending = true;

            //Show users responsive message
            socket.emit(socketEmitters.SEND_MSG_CHAT, data);
            pushToMsg(data.message);
            setMsg("");
            if (!isUserConnected) scrollToBottom({ instant: true });
            //Emits message for other user
            //and then save to server and emit
        } catch (err) {
            throw err;
        }
    };

    const closeHandler = () => {
        setIsLoading(true);
        socket.emit(socketEmitters.CHAT_LEAVE, otherSocketID);
        socket.removeAllListeners();
        onClose();
    };

    return (
        <Drawer
            PaperProps={{
                sx: { width: "100%", height: "100%" },
            }}
            anchor={"bottom"}
            open={open}
            onClose={closeHandler}
        >
            <List>
                <ListItem>
                    <IconButton sx={{ marginRight: 1 }} onClick={closeHandler} style={{ color: "grey" }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <ListItemText>
                        <Typography fontWeight="bold" variant="h6">
                            {OtherUser && OtherUser.username || ""}
                        </Typography>
                    </ListItemText>
                </ListItem>
            </List>
            <Divider />
            {isLoading &&
                <div className="bg-white h-screen w-screen absolute">
                    <Loading />
                </div>
            }

            <div className="h-full px-3 pb-5 overflow-y-auto">
                {messageInfo && messageInfo.messages.map((msg: IMessageSingle, index) => {
                    return (msg.sender as string) === user._id ?
                        <BubbleContainer
                            key={`keyForCOntainer${index}`}
                            msg={msg.message}
                            orientation="right"
                            isSendingProp={isUserConnected && msg.isSending || false}
                        /> :
                        <BubbleContainer
                            key={`keyForCOntainer${index}`}
                            msg={msg.message}
                            orientation="left"
                        />

                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <TextField
                    autoComplete="off"
                    fullWidth
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    label={"message"}
                    variant="outlined"
                />
                <div className="flex justify-center items-center px-2">
                    <IconButton onClick={sendHandler} aria-label="send" color="secondary">
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
        </Drawer>
    );
};

export default DrawerMessages;