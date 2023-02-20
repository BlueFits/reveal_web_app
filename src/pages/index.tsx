import { useState, useEffect } from "react";
import { Button, Typography, IconButton, Link, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Header from "./_components/Header/Header";
import DrawerMenu from "./_components/DrawerMenu/DrawerMenu";
import { useAuth0 } from "@auth0/auth0-react";
import Head from 'next/head'
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import { setAvatar, formSet, IFormSet, setSocketID, setTrialUser } from "../services/modules/User/userSlice";
import { useRouter } from "next/router";
import { IChatType } from "./dashboard/components/PreChatPage/PreChatPage";
import { gender } from "../../server/Users/dto/users.dto";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
import socket from "../../config/Socket";
import socketEmitters from "../constants/emitters";


const backgroundURL = "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80";


const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const theme = useTheme();
    const notSm = useMediaQuery(theme.breakpoints.up('sm'));
    const { loginWithRedirect } = useAuth0();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

    return (
        <>
            <Head>
                <title>Reveal</title>
            </Head>
            <div className="overflow-x-hidden">
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
                        <div className="w-4/6 text-center">
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
                                    onClick={tryNowHandler}
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
                                    onClick={() => loginWithRedirect()}
                                    style={{ border: "3px solid" }}
                                    // style={{ backgroundColor: colors.primary }}
                                    size="large"
                                    sx={{ borderRadius: 9999 }}
                                    variant="outlined"
                                >
                                    Get Started
                                </Button>
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
                                <Link color="inherit" href="mailto:support@reveal-app.site"> support@reveal-app.site</Link>
                                .
                            </Typography>
                        </div>
                    </div>
                </section>
                <footer className="p-4">
                    <Divider sx={{ margin: "10px 0" }} />
                    <ul className="flex justify-center items-center">
                        <FooterLinks>
                            <Typography variant="caption">FAQ</Typography>
                        </FooterLinks>
                        <FooterLinks disableSlash>
                            <Typography variant="caption">Terms</Typography>
                        </FooterLinks>
                    </ul>
                </footer>
            </div>
        </>
    );
};

export default Index;