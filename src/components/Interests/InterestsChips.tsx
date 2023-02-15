import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { useSelector, useDispatch } from 'react-redux';
import { IUserReducer } from '../../services/modules/User/userSlice';
import { IReducer } from '../../services/store';
import { updateUser } from '../../services/modules/User/userSlice';
import { apiTempUser } from '../../services/modules/otherUserSlice';

interface IInterestChips {
    readOnly?: boolean;
    user: IUserReducer | apiTempUser;
}

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const InterestsChips: React.FC<IInterestChips> = ({ readOnly = false, user }) => {

    const dispatch = useDispatch();

    const deleteHandler = async (interest) => {
        const newInterests = user.interests.filter((interestCompare: string) => interestCompare !== interest);
        await dispatch(updateUser({
            id: user._id,
            fields: {
                interests: newInterests
            }
        }));
    }

    return !readOnly ? (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                boxShadow: "none",
            }}
            component="ul"
        >
            {user.interests.map((interest, index) => {
                return (
                    <ListItem key={index}>
                        <Chip
                            icon={null}
                            label={interest}
                            onDelete={() => deleteHandler(interest)}
                        />
                    </ListItem>
                );
            })}
        </Paper>
    ) : (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                boxShadow: "none",
                backgroundColor: "transparent"
            }}
            component="ul"
        >
            {user && user.interests && user.interests.map((interest, index) => {
                return (
                    <ListItem key={index}>
                        <Chip
                            icon={null}
                            label={interest}
                            style={{
                                border: "1px solid #fff",
                                color: "#fff",
                                fontSize: "18px"
                            }}
                        />
                    </ListItem>
                );
            })}
        </Paper>
    );
}

export default InterestsChips;