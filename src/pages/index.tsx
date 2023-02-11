import { useState } from "react";
import { Button, Typography, IconButton, Link, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Header from "./_components/Header/Header";
import DrawerMenu from "./_components/DrawerMenu/DrawerMenu";
import { useAuth0 } from "@auth0/auth0-react";
import Head from 'next/head'


const Index = () => {
    const { loginWithRedirect } = useAuth0();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const FooterLinks = ({ disableSlash = false, children }) => (
        <li>
            {children}
            {
                !disableSlash &&
                <Typography style={{ margin: "0 1rem" }} variant="caption">/</Typography>
            }
        </li>
    );

    return (
        <>
            <Head>
                <title>Reveal</title>
            </Head>
            <div className="overflow-x-hidden">
                <div
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1571771826307-98d0d0999028?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')"
                    }}
                    className={"bg-cover bg-no-repeat bg-center h-screen w-screen flex flex-col justify-between"}
                >
                    <Header
                        headerButtonOnClick={() => setIsDrawerOpen(true)}
                        disableIcon
                        icon={<MenuIcon fontSize="inherit" color="primary" />}
                    />
                    {/* <DrawerMenu
                    onClose={() => setIsDrawerOpen(false)}
                    open={isDrawerOpen}
                /> */}
                    <div className="flex items-center flex-col justify-center">
                        <div className="w-4/6 text-center">
                            <Typography fontWeight={"bold"} color="#fff" variant="h4">
                                Start Chatting Now
                            </Typography>
                            <div className="mt-4">
                                <Button
                                    color="light"
                                    onClick={() => loginWithRedirect()}
                                    style={{ border: "3px solid" }}
                                    size="large"
                                    disableElevation
                                    sx={{ borderRadius: 9999 }}
                                    fullWidth
                                    variant="outlined"
                                >
                                    Chat now
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
                        <Typography marginBottom={2} variant="h6">Welcome to Reveal Alpha!</Typography>
                        <Typography variant="body2">
                            Ever wanted to go to a blind date? Now is your chance!
                            With Reveal, get to know someone based on their personality and not for how
                            they look, at the start anyways. You will be put in a room with someone and
                            you can talk to them without seeing them first. After awhile a prompt will show
                            up in which the two of you can then decide to see each other. So what are
                            you waiting for find someone today with Reveal!
                        </Typography>
                        <Divider sx={{ margin: "15px 0" }} />
                        <div className="flex flex-col">
                            <Typography marginBottom={1} fontWeight={"bold"} variant="caption">Disclaimer </Typography>
                            <Typography variant="caption">
                                Please note that this is an alpha version of Reveal which is still undergoing
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