import { useState, useEffect } from "react";
import { Typography, Button, TextField, MenuItem, FormControl, Alert } from "@mui/material";
import FormBlock from "../../components/FormBlock/FormBlock";
import FormShowMe from "../../components/Forms/FormShowMe/FormShowMe";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs, { Dayjs } from 'dayjs';
import { gender } from "../../../server/Users/dto/users.dto";
import { useDispatch, useSelector } from "react-redux";
import { IUserReducer, updateUserByForm } from "../../services/modules/User/userSlice";
import { IReducer } from "../../services/store";
import { useRouter } from "next/router";
import { serverURL } from "../../../config/Server";
import GenderForm from "../../components/Forms/GenderForm/GenderForm";
import colors from "../../constants/ui/colors";
import Head from 'next/head';
import analyticEvents from "../../constants/analytics/analyticEvents";
import { TRACKING_ID } from "../../../config/GoogleAnalyticsConfig";

export async function getServerSideProps({ params, req }) {
    const referer = req.headers.referer || null
    return {
        props: {
            referer
        }
    }
}

const InitialSetup = ({ referer }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const [username, setUsername] = useState<string>("");
    const [birthday, setBirthday] = useState<Dayjs | null>(dayjs('2014-08-18T21:11:54'));
    const [genderSelection, setGenderSelection] = useState<gender>(gender.Male);
    const [showMe, setShowMe] = useState<gender>(gender.Female);
    const [errs, setErrs] = useState<Array<string>>([]);

    useEffect(() => {
        if (referer !== `${serverURL}/dashboard`) router.push("/");
    }, [referer]);

    const birthdayChange = (newValue: Dayjs | null) => {
        setBirthday(newValue);
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setGenderSelection(event.target.value as gender);
    };

    const handleShowMeChange = (event: SelectChangeEvent) => {
        setShowMe(event.target.value as gender);
    };

    const submitHandler = async () => {
        gtag("event", analyticEvents.CLICK.SETUP_SIGNUP, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });

        let newErrs = [];

        if (birthday.isAfter(dayjs("2005-12-30"))) {
            newErrs.push("User is not over 18")
        }
        if (username.length <= 0) {
            newErrs.push("Username cannot be empty");
        }

        if (newErrs.length > 0) {
            setErrs(newErrs);
            return;
        }

        await dispatch(updateUserByForm({
            id: userReducer._id,
            birthday: birthday.toDate(),
            gender: genderSelection,
            showMe,
            username,
        }));
        router.push("/dashboard");

        setErrs([]);
    }

    return referer === `${serverURL}/dashboard` ?
        (
            <>
                <Head>
                    <title>Reveal | Setup</title>
                </Head>
                <div className="p-7 flex flex-col">
                    <Typography fontWeight={"bold"} variant="h4" marginBottom={2}>Reveal Early Sign Up</Typography>
                    <Typography variant="body1" marginBottom={5}>Here are some things we need to know about you before our launch</Typography>
                    <FormControl>
                        <FormBlock
                            label="Display Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <div className="mb-4">
                            <Typography marginBottom={2} variant="h5">{"Date of Birth"}</Typography>
                            <div className="hidden lg:block">
                                <DesktopDatePicker
                                    className="w-full"
                                    label="Date of Birth"
                                    inputFormat="MM/DD/YYYY"
                                    value={birthday}
                                    onChange={(birthdayChange)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </div>
                            <div className="lg:hidden">
                                <MobileDatePicker
                                    className="w-full"
                                    label="Date of Birth"
                                    inputFormat="MM/DD/YYYY"
                                    value={birthday}
                                    onChange={birthdayChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </div>
                        </div>
                    </FormControl>
                    <FormControl>
                        <GenderForm
                            genderSelection={genderSelection}
                            handleSelectChange={handleSelectChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormShowMe
                            value={showMe}
                            onChange={handleShowMeChange}
                        />
                    </FormControl>
                    <div className="flex justify-center items-center flex-col">
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
            </>
        ) : (
            <p>Invalid page redirecting...</p>
        )

};

export default InitialSetup;