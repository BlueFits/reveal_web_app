import { useState, useEffect } from "react";
import { Button, Typography, IconButton, Link, Divider, TextField } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Header from "../components/Header/Header";
import DrawerMenu from "./_components/DrawerMenu/DrawerMenu";
import { useAuth0 } from "@auth0/auth0-react";
import Head from 'next/head'
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import colors from "../constants/ui/colors";
import { useDispatch } from "react-redux";
import { setAvatar, formSet, IFormSet, setSocketID, setTrialUser } from "../services/modules/User/userSlice";
import { useRouter } from "next/router";
import { IChatType } from "./dashboard/components/PreChatPage/PreChatPage";
import { gender } from "../../server/Users/dto/users.dto";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
import socket from "../utils/Socket/socket.utils";
import socketEmitters from "../constants/types/emitters";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import analyticEvents from "../constants/analytics/analyticEvents";
import { TRACKING_ID } from "../../config/GoogleAnalyticsConfig";
import Logo from "../components/Logo/Logo";


const backgroundURL = "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80";


const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const theme = useTheme();
    const notSm = useMediaQuery(theme.breakpoints.up('sm'));
    const { loginWithRedirect } = useAuth0();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [over18Prompt, setOver18Prompt] = useState(false);
    const [isUser18, setIsUser18] = useState<0 | 1 | 2>(0);

    useEffect(() => {
        socket.emit(socketEmitters.SOCKET_ROOM_GET);
        socket.emit(socketEmitters.REQUEST_ID)
        socket.once(socketEmitters.ME, (socketID: string) => {
            dispatch(setSocketID(socketID));
        })
    }, []);

    const FooterLinks = ({ disableSlash = false, children }) => (
        <li>
            {children}
            {
                !disableSlash &&
                <Typography style={{ margin: "0 1rem" }} variant="caption">/</Typography>
            }
        </li>
    );

    const tryNowHandler = () => {
        dispatch(setAvatar());
        dispatch(setTrialUser(true));
        console.log("generated id", uuidv4());
        const data: IFormSet = {
            birthday: null,
            gender: gender.Male,
            showMe: gender.Female,
            username: "Guest",
            matches: [],
        };
        dispatch(formSet(data));

        router.push({
            pathname: "/chat",
            query: { chatType: IChatType.OPEN }
        });
    }

    const earlySignUpHandler = () => {
        gtag("event", analyticEvents.CLICK.HOME_EARLY_SIGN_UP, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });
        loginWithRedirect()
    }

    return (
        <>
            <Head>
                <title>Reveal</title>
            </Head>
            <div className="overflow-x-hidden">
                <Dialog fullScreen={!notSm} fullWidth open={over18Prompt} onClose={() => setOver18Prompt(false)}>
                    {
                        isUser18 === 2 ?
                            <>
                                <DialogTitle>You must be over 18 to enter this site</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        You are not allowed to enter this site
                                    </DialogContentText>
                                    <DialogActions sx={{ marginTop: 3 }}>
                                        <Button color="secondary" onClick={() => setOver18Prompt(false)}>Close</Button>
                                    </DialogActions>
                                </DialogContent>
                            </> :
                            <>
                                <DialogTitle>Are you 18 or over?</DialogTitle>
                                <DialogContent>
                                    <DialogContentText marginBottom={2}>
                                        You must be 18 years old or over to use Reveal
                                    </DialogContentText>
                                    <DialogActions sx={{ marginTop: 3 }}>
                                        <Button color="secondary" onClick={() => setIsUser18(2)}>Under 18</Button>
                                        <Button color="secondary" onClick={() => {
                                            gtag("event", analyticEvents.CLICK.HOME_OVER_18, {
                                                page_path: window.location.pathname,
                                                send_to: TRACKING_ID,
                                            });
                                            tryNowHandler()
                                        }}>
                                            18 or over
                                        </Button>
                                    </DialogActions>
                                </DialogContent>
                            </>
                    }

                </Dialog>
                <div
                    style={{
                        backgroundImage: `url('${backgroundURL}')`
                    }}
                    className={"bg-cover bg-no-repeat bg-center h-screen w-screen flex flex-col justify-between relative"}
                >
                    <div className="bg-black h-full w-full absolute opacity-20"></div>
                    <Header
                        headerButtonOnClick={() => setIsDrawerOpen(true)}
                        disableIcon
                        icon={<MenuIcon fontSize="inherit" color="primary" />}
                    />
                    {/* <DrawerMenu
                    onClose={() => setIsDrawerOpen(false)}
                    open={isDrawerOpen}
                /> */}
                    <div className="flex items-center flex-col justify-center z-10">
                        <div className="w-4/6 text-center flex flex-col justify-center items-center">
                            <Typography fontWeight={"bold"} color="#fff" variant="h3">
                                Connect Beyond Sight
                            </Typography>
                            <Typography marginTop={2} marginBottom={5} color="#fff" variant="subtitle1">
                                {/* Get on a call without showing what you look like, and then decide if you both want to reveal! */}
                                Try speed blindfold dating online with reveal!
                            </Typography>
                            <div className="mt-4 flex flex-col justify-center items-center">
                                <Button
                                    className="global_bttn_width"
                                    color="light"
                                    onClick={earlySignUpHandler}
                                    style={{ backgroundColor: colors.primary, marginBottom: 20 }}
                                    size="large"
                                    sx={{ borderRadius: 9999 }}
                                    variant="contained"
                                >
                                    Early Sign Up
                                </Button>
                                {/* <Button
                                    className="global_bttn_width"
                                    color="light"
                                    onClick={() => {
                                        gtag("event", analyticEvents.CLICK.HOME_TRY_OPEN_CHAT, {
                                            page_path: window.location.pathname,
                                            send_to: TRACKING_ID,
                                        });
                                        setOver18Prompt(true);
                                    }}
                                    style={{ backgroundColor: colors.primary, marginBottom: 20 }}
                                    size="large"
                                    sx={{ borderRadius: 9999 }}
                                    variant="contained"
                                >
                                    Try Open Chat
                                </Button>
                                <Button

                                    className="global_bttn_width"
                                    color="light"
                                    onClick={() => {
                                        gtag("event", analyticEvents.CLICK.HOME_GET_STARTED, {
                                            page_path: window.location.pathname,
                                            send_to: TRACKING_ID,
                                        });
                                        loginWithRedirect()
                                    }}
                                    style={{ border: "3px solid" }}
                                    // style={{ backgroundColor: colors.primary }}
                                    size="large"
                                    sx={{ borderRadius: 9999 }}
                                    variant="outlined"
                                >
                                    Get Started
                                </Button> */}
                            </div>
                        </div>
                    </div>
                    {/* Button Container */}
                    <div></div>
                </div>
                <section className="py-6 px-4 flex justify-center items-center">
                    <div className="max-w-5xl">
                        {/* <Divider sx={{ margin: "10px 0" }} /> */}
                        <Typography marginBottom={2} variant="h6">Welcome to Reveal!</Typography>
                        <Typography variant="body2">
                            Ever wanted to go to a blind date?
                            With Reveal you will be put in a room with someone and
                            you can talk to them without seeing them at first. After awhile a prompt will show
                            up in which the two of you can then decide to see each other. So what are
                            you waiting for and find someone today with Reveal!
                        </Typography>
                        <Divider sx={{ margin: "15px 0" }} />
                        <div className="flex flex-col">
                            <Typography marginBottom={1} fontWeight={"bold"} variant="caption">Disclaimer </Typography>
                            <Typography variant="caption">
                                Please note that this is an early access version of Reveal which is still undergoing
                                multiple testing before its official release.
                                We have opened access to the alpha version only for testing purposes.
                                Should you encounter any bugs, glitches, lack of functionality or
                                other problems on the website, please let us know immediately so we
                                can rectify these accordingly. Your help in this regard is greatly
                                appreciated! You can write to us at this address
                                <Link color="inherit" href="mailto:support@reveal-app.site"> support@reveal-app.co</Link>
                                .
                            </Typography>
                        </div>
                    </div>
                </section>
                <footer className="p-4">
                    <Divider sx={{ margin: "10px 0" }} />
                    <ul className="flex justify-center items-center">
                        {/* <FooterLinks>
                            <Typography variant="caption">FAQ</Typography>
                        </FooterLinks> */}
                        <FooterLinks disableSlash>
                            <Link style={{ textDecoration: "none", color: "inherit" }} href="/privacy">
                                <Typography variant="caption">Terms</Typography>
                            </Link>
                        </FooterLinks>
                    </ul>
                </footer>
            </div>
        </>
    );
};

export default Index;