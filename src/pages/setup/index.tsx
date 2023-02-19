import { useState, useEffect } from "react";
import { Typography, Button, TextField, MenuItem, FormControl } from "@mui/material";
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
import colors from "../../constants/colors";
import Head from 'next/head'

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
        await dispatch(updateUserByForm({
            id: userReducer._id,
            birthday: birthday.toDate(),
            gender: genderSelection,
            showMe,
            username,
        }));
        router.push("/dashboard");
    }

    return referer === `${serverURL}/dashboard` ?
        (
            <>
                <Head>
                    <title>Reveal | Setup</title>
                </Head>
                <div className="p-7 flex flex-col">
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
                    <Button
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
                </div>
            </>
        ) : (
            <p>Invalid page redirecting...</p>
        )

};

export default InitialSetup;