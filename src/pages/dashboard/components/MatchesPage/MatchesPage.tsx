import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { IUserReducer } from '../../../../services/modules/User/userSlice';
import { IMessageReducer, reloadMessages } from '../../../../services/modules/Messages/messagesSlice';
import { IReducer } from '../../../../services/store';
import { Avatar, List, ListItemButton, ListItemAvatar, ListItemText } from "@mui/material"
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import DrawerMessages from './components/DrawerMessages';
import { CreateMessageDto, IMessageSingle } from '../../../../../server/Messages/dto/messages.dto';
import MessagesApi from '../../../../services/modules/Messages/api';
import socket from '../../../../../config/Socket';
import socketEmitters, { IJoinChatData } from '../../../../constants/emitters';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: "none",
}));

const MatchesPage = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const messageReducer: IMessageReducer = useSelector((state: IReducer) => state.messages);

    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<CreateMessageDto>();

    useEffect(() => {
        const asyncInit = async () => {
            await dispatch(reloadMessages(userReducer._id));
        }
        asyncInit();
    }, [userReducer]);

    // useEffect(() => {
    //     console.log(messageReducer);
    // }, [messageReducer]);

    const pushToMessageInfo = (msg: IMessageSingle) => {
        const msgInstance = { ...messageInfo };
        msgInstance.messages = [...msgInstance.messages, msg];
        setMessageInfo(msgInstance);
    }

    const messagesHandler = async (otherUser: IUserReducer) => {
        try {
            const response = await MessagesApi.deepMessageReload(userReducer._id, otherUser._id);
            let data: IJoinChatData | null = null;
            if (!response.ok) {
                const errData = await response;
                console.log(errData.statusText);
                const res = await MessagesApi.initiateMsg(userReducer._id, otherUser._id);
                if (!res.ok) {
                    const error = await res.json();
                    throw error;
                } else {
                    const initiateSuccess: CreateMessageDto = await res.json();
                    console.log("my success", initiateSuccess);
                    data = {
                        messageRoomID: initiateSuccess._id,
                        userSocketID: userReducer.socketID,
                    };
                    setMessageInfo(initiateSuccess);
                }
            } else {
                const resData: CreateMessageDto = await response.json();
                data = {
                    messageRoomID: resData._id,
                    userSocketID: userReducer.socketID,
                };
                setMessageInfo(resData);
            }
            console.log("Joining Chat");
            socket.emit(socketEmitters.JOIN_CHAT, data)
            setIsMessageOpen(true);
        } catch (err) {
            throw err;
        }
    };


    return userReducer && userReducer.matches && userReducer.matches.length > 0 ? (
        <div className='flex items-center h-full flex-col w-full p-5'>
            <DrawerMessages
                open={isMessageOpen}
                onClose={() => setIsMessageOpen(false)}
                user={userReducer}
                OtherUser={(messageInfo && messageInfo.members.find((user: IUserReducer) => user._id !== userReducer._id) as IUserReducer)}
                messageInfo={messageInfo}
                pushToMsg={pushToMessageInfo}
            />
            <div className='w-full flex flex-col mb-5'>
                <Typography variant='h6'>Matches</Typography>
                <Stack
                    direction="row"
                    sx={{ overflowX: "scroll" }}
                >
                    {userReducer.matches.map((match, index) => {
                        return (
                            <Item onClick={messagesHandler.bind(this, match)} key={index + "matchesKey"}>
                                <Avatar sx={{ width: 56, height: 56 }} alt={`${match.username} avatar`} src={match.picture} />
                                <Typography marginTop={0.5} fontWeight={"bold"} variant='body2'>{match.username}</Typography>
                            </Item>
                        );
                    })}
                </Stack>
            </div>
            <div className='w-full flex flex-col mb-5'>
                <Typography variant='h6'>Messages</Typography>
                {messageReducer.messages.length > 0 ? (
                    messageReducer.messages.map((message, index) => {
                        const msgExist = message.messages.length > 0;
                        const latestSender = msgExist ? message.members.find((user: IUserReducer) => user._id === message.messages[0].sender) as IUserReducer : null;
                        const otherUser = (message.members.find((user: IUserReducer) => user._id !== userReducer._id) as IUserReducer);
                        return (
                            <List key={`keyForList:${index}`}>
                                <ListItemButton onClick={messagesHandler.bind(this, otherUser)}>
                                    <ListItemAvatar>
                                        <Avatar alt="Profile Picture" src={undefined} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={otherUser.username}
                                        secondary={msgExist ? `${userReducer.username === latestSender.username ? "You" : latestSender.username}: ${message.messages[0].message}` : ""}
                                    />
                                </ListItemButton>
                            </List>
                        )
                    })
                ) : (
                    <div className='mt-3'>
                        <Typography>No messages yet, start a conversation with someone!</Typography>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className='flex justify-center items-center h-full'>
            <Typography variant='h4'>No Matches</Typography>
        </div>
    );
}

export default MatchesPage;