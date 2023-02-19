import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserByAuthID, IUserReducer, getUserByEmail } from "../../services/modules/User/userSlice";
import { IReducer } from "../../services/store";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
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


const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MuiBottomNavigationAction = styled(BottomNavigationAction)(`
  &.Mui-selected {
    color: #9b59b6;
  }
`);

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const { user, isAuthenticated, isLoading } = useAuth0();
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

    // useEffect(() => {
    //     console.log("my log", userReducer);
    // }, [userReducer]);

    if (isLoading) return (<Loading />);

    return (
        isAuthenticated && !userReducer.isFirstTime ? (
            <>
                <Head>
                    <title>Reveal | dashboard</title>
                </Head>
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
                    <Box sx={{ width: "100%" }}>
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
            <Loading />
        )
    );
};

export default Index;