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
    const [value, setValue] = useState(0);

    useEffect(() => {
        const asyncInit = async () => {
            await dispatch(reloadMessages(userReducer._id));
        }
        asyncInit();
    }, [userReducer]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return userReducer.matches.length > 0 ? (
        <div className='flex items-center h-full flex-col w-full border-2 p-5'>
            <div className='w-full flex flex-col mb-5'>
                <Typography variant='h6'>Matches</Typography>
                <Stack
                    direction="row"
                    sx={{ overflowX: "scroll" }}
                >
                    {userReducer.matches.map((match, index) => {
                        return (
                            <Item key={index + "matchesKey"}>
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
                        const latestSender = message.members.find((user: IUserReducer) => user._id === message.messages[0].sender) as IUserReducer;
                        const otherUser = (message.members.find((user: IUserReducer) => user._id !== userReducer._id) as IUserReducer);
                        return (
                            <List key={`keyForList:${index}`}>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar alt="Profile Picture" src={undefined} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={otherUser.username}
                                        secondary={`${userReducer.username === latestSender.username ? "You" : latestSender.username}: ${message.messages[0].message}`}
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