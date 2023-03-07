import { useState } from "react";
import Head from 'next/head';
import { Typography, Button, Select, MenuItem, FormControl, Alert, Container, SelectChangeEvent } from "@mui/material";
import FormBlock from "../components/FormBlock/FormBlock";
import colors from "../constants/ui/colors";
import { school } from "../../server/PreLaunchUser/dto/prelaunchUser.dto";
import { color } from "@mui/system";
import { serverURL } from "../../config/Server";

const userCollect = () => {

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [schoolSelect, setSchoolSelect] = useState<school | "">("");
    const [errs, setErrs] = useState<Array<any>>([]);
    const [isFinished, setIsFinished] = useState(false);

    const submitHandler = async () => {
        console.log("salut");

        let newErrs = [];

        if (firstName === "") {
            newErrs.push("firstname cannot empty")
        }

        if (email === "") {
            newErrs.push("Email cannot be empty");
        }

        if (schoolSelect === "") {
            newErrs.push("School cannot be empty");
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
                firstName,
                email,
                school: schoolSelect
            }),
        });

        setIsFinished(true);
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSchoolSelect(event.target.value as school);
    }

    return (
        <>
            <Head>
                <title>Reveal | Pre-launch</title>
            </Head>
            <div style={{ backgroundColor: colors.primary }} className="w-screen h-screen">
                {
                    !isFinished ? (
                        <div className="flex justify-center items-center h-screen">
                            <div className="md:h-fit h-screen border-2 p-7 flex flex-col items-center md:rounded-lg shadow-lg shadow-black-500/50 bg-white">
                                <Typography textAlign={"center"} fontWeight={"bold"} variant="h4" marginBottom={2}>
                                    Be the first to experience Reveal
                                </Typography>
                                <Typography textAlign={"center"} variant="body1" marginBottom={5}>
                                    Sign up to get your invitation.
                                </Typography>
                                <FormControl style={{ width: "100%" }}>
                                    <FormBlock
                                        label="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl style={{ width: "100%" }}>
                                    <FormBlock
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <div className="mb-4 w-full">
                                    <Typography marginBottom={2} variant="h5">{"Your School"}</Typography>
                                    <Select
                                        fullWidth
                                        labelId="school-select-label"
                                        id="school-select"
                                        value={schoolSelect}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value={school.YORK}>York University</MenuItem>
                                        <MenuItem value={school.UOFT}>University of Toronto</MenuItem>
                                        <MenuItem value={school.CENTENNIAL}>Centennial</MenuItem>
                                        <MenuItem value={school.GEORGE_BROWN}>George Brown</MenuItem>
                                        <MenuItem value={school.T_METROPOLITAN}>Toronto Metropolitan</MenuItem>
                                    </Select>
                                </div>
                                <div className="flex justify-center items-center flex-col w-full md:w-[150px]">
                                    <Button
                                        className="global_bttn_width"
                                        onClick={submitHandler}
                                        disableElevation
                                        style={{ borderRadius: 9999, padding: 10, backgroundColor: colors.primary }}
                                        fullWidth
                                        color="secondary"
                                        sx={{ margin: "15px 0" }}
                                        variant="contained"
                                    >
                                        Sign Up
                                    </Button>
                                    {
                                        errs.length > 0 && (
                                            errs.map((err, index) => (
                                                <Alert sx={{ marginBottom: 1 }} key={index} severity="error">{err}</Alert>
                                            ))
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
                                    <Button variant="text">Home Page</Button>
                                    <Button variant="text">Socials</Button>
                                    <Button variant="text">Blog</Button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default userCollect;