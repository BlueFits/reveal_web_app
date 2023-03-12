import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserByAuthID, IUserReducer, getUserByEmail } from "../../services/modules/User/userSlice";
import { IReducer } from "../../services/store";
import { BottomNavigation, BottomNavigationAction, Box, Button, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import PreChatPage from "./components/PreChatPage/PreChatPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import VideoChatIcon from '@mui/icons-material/VideoChat';
import Loading from "../../components/Loading/Loading";
import Head from 'next/head'
import MatchesPage from "./components/MatchesPage/MatchesPage";
import Diversity1Icon from '@mui/icons-material/Diversity1';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import colors from "../../constants/ui/colors";
import FeedbackComponent from "../../components/FeedbackComponent/FeedbackComponent";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MuiBottomNavigationAction = styled(BottomNavigationAction)(`
  &.Mui-selected {
    color: ${colors.primary};
  }
`);

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const [value, setValue] = useState<number>(0);
    const [snackBarOpen, setSnackBarOpen] = useState(true);


    const handleSnackBarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };


    useEffect(() => {
        const init = async () => {
            if (!user) router.push("/");
            if (user && user.sub) {
                const response = await dispatch(getUserByEmail(user.email));
                if (response.payload && !response.payload.gender) router.push("/setup");
            }
        }
        if (!isLoading) init();
    }, [user, isLoading]);


    if (isLoading) return (<Loading />);

    return (
        isAuthenticated && !userReducer.isFirstTime ? (
            user && user.email_verified ? (
                <>
                    <Head>
                        <title>Reveal | dashboard</title>
                    </Head>
                    <FeedbackComponent />
                    <div className="h-screen w-screen flex flex-col justify-between">
                        <Snackbar
                            sx={{ maxWidth: 500 }}
                            open={snackBarOpen}
                            autoHideDuration={8 * 1000}
                            onClose={handleSnackBarClose}
                            anchorOrigin={{ horizontal: "right", vertical: "top" }}
                        >
                            <Alert onClose={handleSnackBarClose} severity="info" sx={{ width: '100%' }}>
                                Thank you for participating in Reveal's early access.
                                Should you encounter any bugs, glitches, lack of functionality or
                                other problems on the website, please let us know immediately so we
                                can rectify these accordingly.
                            </Alert>
                        </Snackbar>

                        {value === 0 &&
                            <div className="grow">
                                <PreChatPage
                                    user={userReducer}
                                />
                            </div>
                        }
                        {value === 1 && <MatchesPage />}
                        {value === 2 && <ProfilePage />}
                        <Box sx={{ width: "100%", position: "fixed", bottom: 0 }}>
                            <BottomNavigation
                                showLabels
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                            >
                                <MuiBottomNavigationAction label="Chat" icon={<VideoChatIcon />} />
                                <MuiBottomNavigationAction label="Matches" icon={<Diversity1Icon />} />
                                <MuiBottomNavigationAction label="Profile" icon={<Person />} />
                            </BottomNavigation>
                        </Box>
                    </div>
                </>
            ) : (
                // Verification Redirect
                <div className="flex h-screen w-screen justify-center items-center flex-col p-8">
                    <Typography marginBottom={3} variant="h4">
                        Please verify your email to continue.
                    </Typography>
                    <Typography variant="body1" marginBottom={5}>
                        We sent an email to <strong>{userReducer.auth0.email}</strong>. You are moments away from trying out reveal, please refresh this page once you have verified your email.
                    </Typography>
                    <Button
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                        Back to home page
                    </Button>
                </div>
            )
        ) : (
            <Loading />
        )
    );
};

export default Index;