import { useState, useEffect } from "react";
import Head from 'next/head';
import { Typography, Button, Select, MenuItem, FormControl, Alert, Container, SelectChangeEvent, Link } from "@mui/material";
import FormBlock from "../components/FormBlock/FormBlock";
import colors from "../constants/ui/colors";
import { serverURL } from "../../config/Server";
import analyticEvents from "../constants/analytics/analyticEvents";
import { TRACKING_ID } from "../../config/GoogleAnalyticsConfig";
import Logo from "../components/Logo/Logo";
import validator from 'validator';
import { formColorPreLaunch } from "../constants/ui/colors";
import Image from 'next/image'


const userCollect = () => {

    const [email, setEmail] = useState("");
    const [errs, setErrs] = useState<Array<any>>([]);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, []);

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
            <div style={{ backgroundColor: formColorPreLaunch.white }} className="w-screen h-screen flex justify-center items-center">
                <div className="flex justify-center flex-col h-screen items-center text-center z-10">
                    <div className="hidden md:block max-w-[700px]">
                        <Typography fontWeight={"bold"} variant="h3" marginBottom={7}>
                            Experience a new way to make connections
                        </Typography>
                    </div>
                    {
                        !isFinished ? (
                            <div style={{ backgroundColor: formColorPreLaunch.grey }} className="md:w-[384px] md:h-fit h-screen flex flex-col items-center md:rounded-2xl shadow-lg shadow-black-500/50">
                                <div className="border-b-[1px] w-full flex justify-center py-7">
                                    <div className="max-w-[7rem]">
                                        <Logo />
                                    </div>
                                </div>
                                <div className="p-7">
                                    <Typography color={formColorPreLaunch.white} textAlign={"center"} fontWeight={"bold"} variant="h6" marginBottom={2}>
                                        Sign up to get your invitation.
                                    </Typography>
                                    <Typography color={formColorPreLaunch.white} textAlign={"center"} variant="body1" marginBottom={2}>
                                        Join our waitlist today and be one of the first to experience Reveal
                                    </Typography>
                                    <FormControl style={{ width: "100%" }}>
                                        <FormBlock
                                            textFieldInputLabelProps={{
                                                style: {
                                                    color: formColorPreLaunch.white,
                                                }
                                            }}
                                            textFieldSx={{
                                                marginBottom: 1,
                                                color: formColorPreLaunch.white,
                                                input: {
                                                    color: formColorPreLaunch.white
                                                }
                                            }}
                                            variation="white"
                                            disableLabel
                                            label="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FormControl>
                                    <div className="flex justify-center items-center flex-col w-full">
                                        <Button
                                            className="global_bttn_width"
                                            onClick={submitHandler}
                                            disableElevation
                                            style={{
                                                padding: "12px 0",
                                                backgroundColor: "#FBFBFB",
                                                color: formColorPreLaunch.black
                                            }}
                                            fullWidth
                                            sx={{ margin: "15px 0" }}
                                            variant="contained"
                                        >
                                            <strong>Sign Up</strong>
                                        </Button>
                                    </div>
                                    {
                                        errs.length > 0 && (
                                            <Alert sx={{ marginBottom: 1 }} severity="error">{errs[0]}</Alert>
                                        )
                                    }
                                </div>
                            </div>
                        ) : (
                            <div style={{ backgroundColor: formColorPreLaunch.grey }} className="md:w-[384px] md:h-fit h-screen flex flex-col items-center md:rounded-2xl shadow-lg shadow-black-500/50">
                                <div className="border-b-[1px] w-full flex justify-center py-7">
                                    <div className="max-w-[7rem]">
                                        <Logo />
                                    </div>
                                </div>
                                <div className="p-7">
                                    <Typography color={formColorPreLaunch.white} textAlign={"center"} fontWeight={"bold"} variant="h6" marginBottom={2}>
                                        Thank you for signing up
                                    </Typography>
                                    <Typography color={formColorPreLaunch.white} textAlign={"center"} variant="body1" marginBottom={2}>
                                        Be sure to check your email for updates.
                                    </Typography>
                                    <Link fontWeight={"bold"} color={formColorPreLaunch.white} underline={"hover"} href="/">Home Page</Link>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="hidden md:flex md:absolute md:-bottom-10 md:-right-10 md:max-w-[45%]">
                    <img
                        src={"https://lh6.googleusercontent.com/WNHGhHGiCAQYhSbK8oCdhFWUENhgHt3OaDu9xzQGDuhE9d8LjyuOlSS7Gfj76y74QDg=w2400"}
                    />
                </div>
            </div>
        </>
    );
};

export default userCollect;