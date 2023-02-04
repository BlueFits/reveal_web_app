import { useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
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
import { Typography, Button } from "@mui/material";
import DrawerComponent from "../../../../components/DrawerComponent/DrawerComponent";
import Loading from "../../../../components/Loading/Loading";
import ModalComponent from "../../../../components/ModalComponent/ModalComponent";
import FormBlock from "../../../../components/FormBlock/FormBlock";
import FormShowMe from "../../../../components/FormShowMe/FormShowMe";
import { gender } from "../../../../../server/Users/dto/users.dto";

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

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [showMe, setShowMe] = useState<gender>(gender.Female);
    const [showUsernameSettings, setShowUsernameSettings] = useState(false);
    const [showMeSettings, setShowMeSettings] = useState(false);

    const handleShowMeChange = (event: SelectChangeEvent) => {
        setShowMe(event.target.value as gender);
    };

    const closeModalHandler = () => {
        setShowUsernameSettings(false);
        setShowMeSettings(false);
        setIsOpen(false);
    };

    const usernameHandler = () => {
        setShowUsernameSettings(true);
        setIsOpen(true);
    }

    const showMeHandler = () => {
        setShowMeSettings(true);
        setIsOpen(true);
    }

    return (
        <div className="bg-gray-300 grow flex items-center flex-col">
            <ModalComponent
                handleClose={closeModalHandler}
                open={isOpen}
            >
                {
                    showUsernameSettings && (
                        <div>
                            <FormBlock
                                label="Display Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button
                                // onClick={submitHandler}
                                disableElevation
                                style={{ borderRadius: 9999, padding: 10, backgroundColor: "#9b59b6" }}
                                fullWidth
                                color="secondary"
                                sx={{ margin: "15px 0" }}
                                variant="contained"
                            >
                                update
                            </Button>
                        </div>
                    )
                }
                {
                    showMeSettings && (
                        <FormShowMe
                            value={showMe}
                            onChange={handleShowMeChange}
                        />
                    )
                }
            </ModalComponent>
            {/* <DrawerComponent
                isOpen={isOpen}
                title={drawerTitle}
                onCloseHandler={closeDrawerHandler}
            >
                <div className="bg-gray-300 h-full w-full">
                    
                </div>
            </DrawerComponent> */}
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
                            <ListItemButton onClick={usernameHandler}>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Username" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={showMeHandler}>
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