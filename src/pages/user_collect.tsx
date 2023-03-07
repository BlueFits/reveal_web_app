import { useState } from "react";
import Head from 'next/head';
import { Typography, Button, Select, MenuItem, FormControl, Alert, Container, SelectChangeEvent } from "@mui/material";
import FormBlock from "../components/FormBlock/FormBlock";
import colors from "../constants/ui/colors";


const userCollect = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [school, setSchool] = useState<string>("");
    const [errs, setErrs] = useState<Array<any>>([]);

    const submitHandler = () => {
        console.log("salut");
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSchool(event.target.value);
    }

    return (
        <>
            <Head>
                <title>Reveal | User info collect</title>
            </Head>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: colors.primary,
                }}
                maxWidth="md"
            >
                <div className="border-2 p-7 flex flex-col items-center rounded-lg shadow-lg shadow-black-500/50 bg-white">
                    <Typography fontWeight={"bold"} variant="h4" marginBottom={2}>Reveal Early Sign Up</Typography>
                    <Typography variant="body1" marginBottom={5}>Here are some things we need to know about you before our launch</Typography>
                    <FormControl style={{ width: "100%" }}>
                        <FormBlock
                            label="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl style={{ width: "100%" }}>
                        <FormBlock
                            label="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                            value={school}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={"york"}>York</MenuItem>
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
            </Container>
        </>
    );
};

export default userCollect;