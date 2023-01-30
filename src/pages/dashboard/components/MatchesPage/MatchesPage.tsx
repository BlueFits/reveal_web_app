import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { IUserReducer } from '../../../../services/modules/User/userSlice';
import { IReducer } from '../../../../services/store';
import { Avatar, List, ListItemButton, ListItemAvatar, ListItemText } from "@mui/material"
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: "none",
}));

const MatchesPage = () => {
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const [value, setValue] = useState(0);

    useEffect(() => {
        console.log("my reducer", userReducer);
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
                <List>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar alt="Profile Picture" src={undefined} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={"Brunch this week?"}
                            secondary={"I'll be in the neighbourhood this week. Let's grab a bite to eat"}
                        />
                    </ListItemButton>
                </List>
            </div>
        </div>
    ) : (
        <div className='flex justify-center items-center h-full'>
            <Typography variant='h4'>No Matches</Typography>
        </div>
    );
}

export default MatchesPage;