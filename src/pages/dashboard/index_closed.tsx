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
                    <div className="flex h-screen w-screen justify-center items-center flex-col p-8">
                        <Typography marginBottom={3} variant="h4">
                            Thank you for signing up early!
                        </Typography>
                        <Typography variant="body1" marginBottom={5}>
                            Our launch date is on April 15! Be sure to check <strong>{userReducer.auth0.email}</strong> for any updates.
                        </Typography>
                        <Button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Back to home page
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Head>
                        <title>Reveal | Verification</title>
                    </Head>
                    // Verification Redirect
                    <div className="flex h-screen w-screen justify-center items-center flex-col p-8">
                        <Typography marginBottom={3} variant="h4">
                            Please verify your email to finish the early sign up.
                        </Typography>
                        <Typography variant="body1" marginBottom={5}>
                            We sent an email to <strong>{userReducer.auth0.email}</strong>. You are moments away from finishing sign up for reveal, please refresh this page once you have verified your email.
                        </Typography>
                        <Button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Back to home page
                        </Button>
                    </div>
                </>
            )
        ) : (
            <Loading />
        )
    );
};

export default Index;