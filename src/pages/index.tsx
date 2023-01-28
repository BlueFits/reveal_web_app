import { useState } from "react";
import { Button, Typography, IconButton, Link, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Header from "../components/Header/Header";
import DrawerMenu from "../components/DrawerMenu/DrawerMenu";
import { useAuth0 } from "@auth0/auth0-react";


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
        <div>
            <div
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1611872687047-5e5cabc8e1bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80')"
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
                    <Typography marginBottom={2} variant="h6">Coming soon to the App store!</Typography>
                    <Typography variant="body2">
                        Ever wanted to go to a blind date? Now is your chance!.
                        With Reveal, get to know someone based on their personality and not for how
                        they look, at the start anyways. You will be put in a room with someone and
                        you can talk to them without seeing them first. After awhile a prompt will show
                        up in which the two of you can then decide to see each other. So what are
                        you waiting for find someone today with Reveal!
                    </Typography>
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
    );
};

export default Index;