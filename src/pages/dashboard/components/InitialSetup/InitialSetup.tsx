import { useState, useEffect } from "react";
import { Typography, Button, TextField, MenuItem, FormControl } from "@mui/material";
import FormBlock from "./components/FormBlock";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs, { Dayjs } from 'dayjs';
import { gender } from "../../../../../server/Users/dto/users.dto";
import { useDispatch, useSelector } from "react-redux";
import { formSet, IUserReducer } from "../../../../services/modules/userSlice";
import { IReducer } from "../../../../services/store";


const InitialSetup = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const [username, setUsername] = useState<string>("");
    const [birthday, setBirthday] = useState<Dayjs | null>(dayjs('2014-08-18T21:11:54'));
    const [genderSelection, setGenderSelection] = useState<gender>(gender.Male);
    const [showMe, setShowMe] = useState<gender>(gender.Female);

    useEffect(() => {
        console.log(userReducer);
    }, [userReducer]);

    const birthdayChange = (newValue: Dayjs | null) => {
        setBirthday(newValue);
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setGenderSelection(event.target.value as gender);
    };

    const handleShowMeChange = (event: SelectChangeEvent) => {
        setShowMe(event.target.value as gender);
    };

    const submitHandler = () => {
        dispatch(formSet({
            birthday: birthday.date(),
            gender: genderSelection,
            showMe,
            username,
        }));
    }

    return (
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
                <div className="mb-4">
                    <Typography marginBottom={2} variant="h5">{"Your Gender"}</Typography>
                    <Select
                        fullWidth
                        labelId="gender-select-label"
                        id="gender-simple-select"
                        value={genderSelection}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value={gender.Male}>Male</MenuItem>
                        <MenuItem value={gender.Female}>Female</MenuItem>
                        <MenuItem value={gender.Other}>Other</MenuItem>
                    </Select>
                </div>
            </FormControl>
            <FormControl>
                <div className="mb-4">
                    <Typography marginBottom={2} variant="h5">{"Interested in"}</Typography>
                    <Select
                        fullWidth
                        value={showMe}
                        onChange={handleShowMeChange}
                    >
                        <MenuItem value={gender.Male}>Male</MenuItem>
                        <MenuItem value={gender.Female}>Female</MenuItem>
                        <MenuItem value={gender.Other}>Other</MenuItem>
                    </Select>
                </div>
            </FormControl>
            <Button
                onClick={submitHandler}
                disableElevation
                style={{ borderRadius: 9999, padding: 10 }}
                fullWidth
                color="secondary"
                sx={{ margin: "15px 0" }}
                variant="contained"
            >
                Sign Up
            </Button>
        </div>
    );
};

export default InitialSetup;