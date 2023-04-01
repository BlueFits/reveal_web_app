import { useState, useEffect } from "react";
import Head from 'next/head';
import { Typography, Button, FormControl, Alert, Link } from "@mui/material";
import FormBlock from "../components/FormBlock/FormBlock";
import { serverURL } from "../../config/Server";
import analyticEvents from "../constants/analytics/analyticEvents";
import { TRACKING_ID } from "../../config/GoogleAnalyticsConfig";
import Logo from "../components/Logo/Logo";
import validator from 'validator';
import { formColorPreLaunch } from "../constants/ui/colors";


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
            <div style={{ backgroundColor: formColorPreLaunch.white }} className="w-screen h-screen flex justify-center items-center flex-col">
                <div className="flex justify-center flex-col items-center h-screen text-center z-10">
                    {
                        !isFinished ? (
                            <div className="flex flex-col justify-center items-center relative md:top-[120px] lg:-top-[120px]">
                                <div className="hidden md:block max-w-[700px]">
                                    <Typography fontWeight={"bold"} variant="h3" marginBottom={7}>
                                        Experience a new way to make connections
                                    </Typography>
                                </div>
                                <div style={{ backgroundColor: formColorPreLaunch.grey }} className="border-red-400 md:w-[384px] md:h-fit h-screen flex flex-col items-center md:rounded-2xl shadow-lg shadow-black-500/50 w-screen">
                                    <div className="hidden border-b-[1px] w-full md:flex justify-center py-7">
                                        <div style={{ backgroundColor: formColorPreLaunch.white }} className="max-w-[8rem] py-1 px-3 md:rounded-md">
                                            <Logo variant="dark" />
                                        </div>
                                    </div>
                                    <div className="basis-2/5 sm:hidden w-full flex justify-center bg-white">
                                        <div
                                            style={{
                                                backgroundColor: "rgb(218, 0, 119, 0.1)"
                                            }}
                                            className="h-full w-full flex items-end"
                                        >
                                            <div className="absolute top-5 max-w-[5rem] py-1 px-3 md:rounded-md">
                                                <Logo variant="dark" />
                                            </div>
                                            <img
                                                style={{
                                                    width: "100%",
                                                    position: "relative",
                                                    bottom: -20
                                                }}
                                                src="https://lh3.googleusercontent.com/2XX33DdqijYStj6OkbFJBJj_OWjzYEY-YerEChb68XXkgRQsVe8TmAJgF8lRPrA1M7E=w2400"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: formColorPreLaunch.grey }} className="p-7 z-10 relative z-10 md:rounded-2xl">
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
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center relative md:top-[120px] lg:-top-[120px]">
                                <div style={{ backgroundColor: formColorPreLaunch.grey }} className="md:w-[384px] md:h-fit h-screen flex flex-col items-center md:rounded-2xl shadow-lg shadow-black-500/50 w-screen">
                                    <div className="border-b-[1px] w-full flex justify-center items-center py-10 basis-2/5">
                                        <div className="py-1 px-3 md:rounded-md">
                                            <svg width="80" height="80" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.780029" y="0.279785" width="55.44" height="55.44" rx="27.72" fill="#008705" />
                                                <path d="M10.245 29.6971L24.3132 38.0102C24.9661 38.396 25.8079 38.1854 26.2022 37.5376L40.0442 14.7976" stroke="#FBFBFB" stroke-width="2.8" stroke-linecap="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-7">
                                        <Typography color={formColorPreLaunch.white} textAlign={"center"} fontWeight={"bold"} variant="h6" marginBottom={2}>
                                            We’ve reserved your spot!
                                        </Typography>
                                        <Typography color={formColorPreLaunch.white} textAlign={"center"} variant="body2" marginBottom={5}>
                                            You’ll receive an email from us once we launch
                                        </Typography>
                                        <Link color={formColorPreLaunch.white} underline={"hover"} href="/">
                                            <Typography fontWeight={"bold"} variant="body2">
                                                EXPLORE OUR HOME PAGE
                                            </Typography>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="hidden md:flex md:justify-center md:items-center lg:absolute lg:-bottom-10 lg:-right-10 lg:max-w-[48%]">
                    <img
                        src={"https://lh4.googleusercontent.com/d4ymoQbtSliRobT7NU5bDwc-oRyzndVETN2aM8oxNmjfJCCu1oRSOgGAj6-VoONbGxo=w2400"}
                    />
                </div>
            </div>
        </>
    );
};

export default userCollect;