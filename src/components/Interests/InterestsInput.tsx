import { useState } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { IUserReducer, updateUser } from "../../services/modules/User/userSlice";
import { IReducer } from "../../services/store";


const InterestsInput = () => {

    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);

    const [interestInput, setInterestInput] = useState<string>("");

    const inputKeydownHandler = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            let newInterests = [...userReducer.interests, interestInput];
            await dispatch(updateUser({
                id: userReducer._id,
                fields: {
                    interests: newInterests,
                },
            }));
            setInterestInput("");
        }
    };

    return (
        <TextField
            // InputLabelProps={{ style: { textAlign: "center", width: "100%", } }}
            inputProps={{ style: { textAlign: "center" } }}
            multiline
            placeholder={"E.g. Isn't Reveal awesome?"}
            value={interestInput}
            onChange={e => setInterestInput(e.target.value)}
            fullWidth
            label="Tell people about your interests:"
            variant="standard"
            onKeyDown={inputKeydownHandler}
        />
    );
};

export default InterestsInput;