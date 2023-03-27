import { useState } from "react";
import Head from 'next/head';
import { Typography, Button, Select, MenuItem, FormControl, Alert, Container, SelectChangeEvent, Link } from "@mui/material";
import FormBlock from "../components/FormBlock/FormBlock";
import colors from "../constants/ui/colors";
import { serverURL } from "../../config/Server";
import analyticEvents from "../constants/analytics/analyticEvents";
import { TRACKING_ID } from "../../config/GoogleAnalyticsConfig";
import Logo from "../components/Logo/Logo";
import validator from 'validator';

const formColor = {
    black: "#1E1E1E",
    white: "#FBFBFB",
};

const userCollect = () => {

    const [email, setEmail] = useState("");
    const [errs, setErrs] = useState<Array<any>>([]);
    const [isFinished, setIsFinished] = useState(false);

    const submitHandler = async () => {

        gtag("event", analyticEvents.CLICK.PRELAUNCH_SIGNUP, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });

        let newErrs = [];

        if (email === "") {
            newErrs.push("Email cannot be empty");
        }

        if (!validator.isEmail(email)) {
            newErrs.push("Invalid email");
        }

        if (newErrs.length > 0) {
            setErrs(newErrs);
            return;
        }

        await fetch(`${serverURL}/api/prelaunch`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
            }),
        });

        setIsFinished(true);
    }


    return (
        <>
            <Head>
                <title>Reveal | Pre-launch</title>
            </Head>
            <div style={{ backgroundColor: colors.primary }} className="w-screen h-screen flex justify-center items-center">
                {
                    !isFinished ? (
                        <div className="flex justify-center flex-col h-screen items-center border-2">
                            <h1>asdasd</h1>
                            <div style={{ backgroundColor: formColor.black }} className="md:w-[384px] md:h-[381px] h-screen border-2 flex flex-col items-center md:rounded-lg shadow-lg shadow-black-500/50">
                                <div className="border-2 w-full flex justify-center py-7">
                                    <div className="max-w-[7rem] border-2">
                                        <Logo />
                                    </div>
                                </div>
                                <div className="p-7">
                                    <Typography color={formColor.white} textAlign={"center"} fontWeight={"bold"} variant="h6" marginBottom={2}>
                                        Sign up to get your invitation.
                                    </Typography>
                                    <Typography textAlign={"center"} variant="body1" marginBottom={2}>
                                        Join our waitlist today and be one of the first to experience Reveal
                                    </Typography>
                                    <FormControl style={{ width: "100%" }}>
                                        <FormBlock
                                            textFieldSx={{ marginBottom: 1 }}
                                            disableLabel
                                            label="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FormControl>
                                    <div className="flex justify-center items-center flex-col w-full">
                                        <Button
                                            className="global_bttn_width"
                                            onClick={submitHandler}
                                            disableElevation
                                            style={{ padding: "12px 0", backgroundColor: "#FBFBFB", color: formColor.black }}
                                            fullWidth
                                            sx={{ margin: "15px 0" }}
                                            variant="contained"
                                        >
                                            Sign Up
                                        </Button>
                                    </div>
                                    {
                                        errs.length > 0 && (
                                            <Alert sx={{ marginBottom: 1 }} severity="error">{errs[0]}</Alert>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-screen">
                            <div className="w-full sm:w-fit md:h-fit h-screen border-2 p-7 flex flex-col items-center md:rounded-lg shadow-lg shadow-black-500/50 bg-white justify-center">
                                <Typography textAlign={"center"} fontWeight={"bold"} variant="h5" marginBottom={2}>
                                    Thank you for signing up
                                </Typography>
                                <Typography textAlign={"center"} variant="body1" marginBottom={5}>
                                    Be sure to check your email for updates.
                                </Typography>
                                <div className="flex flex-col justify-center items-center">
                                    <Typography textAlign={"center"} variant="body1" marginBottom={2}>
                                        Find out more about us
                                    </Typography>
                                    <Link underline={"hover"} href="/">Home Page</Link>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    );
};

export default userCollect;