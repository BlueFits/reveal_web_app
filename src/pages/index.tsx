import { useState } from "react";
import { Button, Typography, IconButton, Link } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Header from "../components/Header/Header";
import DrawerMenu from "../components/DrawerMenu/DrawerMenu";
import { useAuth0 } from "@auth0/auth0-react";


const Index = () => {
    const { loginWithRedirect } = useAuth0();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div>
            <div
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1611872687047-5e5cabc8e1bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80')"
                }}
                className={"bg-cover bg-no-repeat bg-center h-screen w-screen flex flex-col justify-between"}
            >
                {/* Header */}
                <Header
                    headerButtonOnClick={() => setIsDrawerOpen(true)}
                    icon={<MenuIcon fontSize="inherit" color="primary" />}
                />
                <DrawerMenu
                    onClose={() => setIsDrawerOpen(false)}
                    open={isDrawerOpen}
                />
                {/* Middle Text */}
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
        </div>
    );
};

export default Index;