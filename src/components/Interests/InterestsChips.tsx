import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { useSelector, useDispatch } from 'react-redux';
import { IUserReducer } from '../../services/modules/User/userSlice';
import { IReducer } from '../../services/store';
import { updateUser } from '../../services/modules/User/userSlice';

interface ChipData {
    key: number;
    label: string;
}

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const InterestsChips = () => {

    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);


    const [chipData, setChipData] = React.useState<readonly ChipData[]>([
        { key: 0, label: 'Angular' },
        { key: 1, label: 'jQuery' },
        { key: 2, label: 'Polymer' },
        { key: 3, label: 'React' },
        { key: 4, label: 'Vue.js' },
    ]);

    const handleDelete = (chipToDelete: string) => () => {
        // setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
        console.log("Deleting chip", chipToDelete);
    };

    const deleteHandler = async (interest) => {
        const newInterests = userReducer.interests.filter((interestCompare: string) => interestCompare !== interest);
        await dispatch(updateUser({
            id: userReducer._id,
            fields: {
                interests: newInterests
            }
        }));
    }

    return (
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
            {userReducer.interests.map((interest, index) => {
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
    );
}

export default InterestsChips;