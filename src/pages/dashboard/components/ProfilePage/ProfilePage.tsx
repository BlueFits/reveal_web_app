import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import EmailIcon from '@mui/icons-material/Email';
import { IUserReducer } from "../../../../services/modules/User/userSlice";
import { useSelector } from "react-redux";
import { IReducer } from "../../../../services/store";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Typography } from "@mui/material";

const sxStyles = {
    box: {
        width: '100%',
        bgcolor: 'background.paper',
        marginBottom: 4
    },
};

const ProfilePage = () => {
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const { logout } = useAuth0();

    return (
        <div className="bg-gray-300 grow flex items-center flex-col">
            <Box sx={sxStyles.box}>
                <nav aria-label="main mailbox folders">
                    <List subheader={<ListSubheader>Account Settings</ListSubheader>} >
                        <ListItem disablePadding>
                            <ListItemButton disabled>
                                <ListItemIcon>
                                    <EmailIcon />
                                </ListItemIcon>
                                <ListItemText primary="Email" />
                                <ListItemText primary={userReducer && userReducer.auth0 && userReducer.auth0.email} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Username" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Looking For" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
            <Box sx={sxStyles.box}>
                <nav aria-label="secondary mailbox folders">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}

                            >
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
            <Typography variant="h6" fontWeight={"bold"}>Reveal</Typography>
            <Typography>Version 0.0.1</Typography>
        </div>
    );
};

export default ProfilePage;