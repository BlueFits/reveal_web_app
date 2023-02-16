import { useState, forwardRef, useEffect } from "react";
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
import { Typography, Button, Avatar } from "@mui/material";
import DrawerComponent from "../../../../components/DrawerComponent/DrawerComponent";
import FormShowMe from "../../../../components/FormShowMe/FormShowMe";
import { gender, PatchUserDto } from "../../../../../server/Users/dto/users.dto";
import { updateUser } from "../../../../services/modules/User/userSlice";
import { useDispatch } from "react-redux";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import colors from "../../../../constants/colors";
import { TRACKING_ID } from "../../../../../config/GoogleAnalyticsConfig";
import ShareReveal from "../../../../components/ShareReveal/ShareReveal";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const sxStyles = {
    box: {
        width: '100%',
        bgcolor: 'background.paper',
        marginBottom: 4
    },
};

const ProfilePage = () => {
    const theme = useTheme();
    const notSm = useMediaQuery(theme.breakpoints.up('sm'));
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const { logout } = useAuth0();

    const [username, setUsername] = useState<string>("");
    const [showMe, setShowMe] = useState<gender>(userReducer.showMe);
    const [showUsernameSettings, setShowUsernameSettings] = useState(false);
    const [showMeSettings, setShowMeSettings] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarError, setSnackBarError] = useState(false);
    const [error, setError] = useState<string>("");
    const [photoURL, setPhotoURL] = useState<string>("");
    const [profilePhotoSettings, setProfilePhotoSettings] = useState(false);

    // useEffect(() => {
    //     console.log(userReducer);
    //     setShowMe(userReducer.showMe);
    //     console.log(showMe);
    // }, [userReducer]);

    //Google Analytics

    useEffect(() => {
        gtag("event", "profile-focus", {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });
    }, []);

    const handleShowMeChange = (event: SelectChangeEvent) => {
        setShowMe(event.target.value as gender);
    };

    const usernameHandler = () => {
        setShowUsernameSettings(true);
    }

    const showMeHandler = () => {
        setShowMeSettings(true);
    }

    const submitHandler = async (fields: PatchUserDto) => {
        const res = await dispatch(updateUser({ fields, id: userReducer._id }));
        if (res.payload.error) {
            console.log(res.payload);
            setError(res.payload.error);
            setSnackBarError(true);
            return;
        }
        setProfilePhotoSettings(false);
        setPhotoURL("");
        setUsername("");
        setShowUsernameSettings(false);
        setShowMeSettings(false);
        setError("");
        setSnackBarOpen(true);
    }

    const handleSnackBarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };


    const handleSnackBarError = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarError(false);
    };


    return (
        <div className="bg-gray-300 grow flex items-center flex-col">

            <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
                    Succesfully Updated Settings
                </Alert>
            </Snackbar>

            <Snackbar open={snackBarError} autoHideDuration={6000} onClose={handleSnackBarError}>
                <Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Dialog fullScreen={!notSm} fullWidth open={showUsernameSettings} onClose={() => setShowUsernameSettings(false)}>
                <DialogTitle>Username</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a new username.
                    </DialogContentText>
                    <TextField
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        autoFocus
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        placeholder={userReducer.username}
                    />
                    <DialogActions sx={{ marginTop: 3 }}>
                        <Button color="secondary" onClick={() => setShowUsernameSettings(false)}>Cancel</Button>
                        <Button color="secondary" onClick={submitHandler.bind(this, { username })}>Save</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog fullScreen={!notSm} fullWidth open={showMeSettings} onClose={() => setShowMeSettings(false)}>
                <DialogTitle>Interested in</DialogTitle>
                <DialogContent>
                    <DialogContentText marginBottom={2}>
                        Choose which gender you want to have calls with in the normal chat
                    </DialogContentText>
                    <FormShowMe
                        hideTitle
                        value={showMe}
                        onChange={handleShowMeChange}
                    />
                    <DialogActions sx={{ marginTop: 3 }}>
                        <Button color="secondary" onClick={() => setShowMeSettings(false)}>Cancel</Button>
                        <Button color="secondary" onClick={submitHandler.bind(this, { showMe })}>Save</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog fullScreen={!notSm} fullWidth open={profilePhotoSettings} onClose={() => setProfilePhotoSettings(false)}>
                <DialogTitle>Profile Photo</DialogTitle>
                <DialogContent>
                    <DialogContentText marginBottom={2}>
                        Direct upload is currently not supported, however you could use a photo from any url
                    </DialogContentText>
                    <TextField
                        onChange={(e) => setPhotoURL(e.target.value)}
                        value={photoURL}
                        autoFocus
                        margin="dense"
                        label="Photo URL"
                        type="text"
                        fullWidth
                        variant="standard"
                        placeholder={userReducer.picture ? (userReducer && userReducer.picture) : ""}
                    />
                    <DialogActions sx={{ marginTop: 3 }}>
                        <Button color="secondary" onClick={() => setProfilePhotoSettings(false)}>Cancel</Button>
                        <Button color="secondary" onClick={submitHandler.bind(this, { picture: photoURL || "" })}>Save</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            {/* <DrawerComponent
                isOpen={isOpen}
                title={drawerTitle}
                onCloseHandler={closeDrawerHandler}
            >
                <div className="bg-gray-300 h-full w-full">
                    
                </div>
            </DrawerComponent> */}
            <Box sx={{ ...sxStyles.box }}>
                <List subheader={<ListSubheader>Profile</ListSubheader>} >
                    <div className="flex justify-center items-center mb-5">
                        <Avatar
                            sx={{ width: 80, height: 80 }}
                            alt={`${userReducer.username} avatar`}
                            src={(userReducer && userReducer.picture) || (userReducer.auth0 && userReducer.auth0.picture) || ""}
                        />
                    </div>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setProfilePhotoSettings(true)}>
                            <ListItemIcon>
                                <AddAPhotoIcon />
                            </ListItemIcon>
                            <ListItemText primary="Photo URL" />
                            <ListItemText
                                sx={{ color: colors.grey }}
                                style={{ width: "min-content" }}
                                primary={
                                    ((userReducer && userReducer.picture) || (userReducer && userReducer.auth0 && userReducer.auth0.picture)) ?
                                        ((userReducer && userReducer.picture) || (userReducer.auth0 && userReducer.auth0.picture)).substring(0, 20) + "..." :
                                        ""
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>

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
                                <ListItemText sx={{ color: colors.grey }} primary={userReducer && userReducer.username} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={showMeHandler}>
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Looking For" />
                                <ListItemText sx={{ color: colors.grey }} primary={(() => {
                                    switch (userReducer && userReducer.showMe) {
                                        case gender.Male:
                                            return "Male"
                                        case gender.Female:
                                            return "Female";
                                        case gender.Gay:
                                            return "Gay";
                                        case gender.Lesbian:
                                            return "Lesbian";
                                        default:
                                            return "Undefined"
                                    }
                                })()} />
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

            <div className="mt-10 flex flex-col justify-center items-center">
                <Typography marginBottom={3} variant="body1">Share Reveal</Typography>
                <ShareReveal />
            </div>
        </div >
    );
};

export default ProfilePage;