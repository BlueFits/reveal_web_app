import { useState } from "react";
import { TextField } from "@mui/material"


const InterestsInput = () => {

    return (
        <TextField
            // InputLabelProps={{ style: { textAlign: "center", width: "100%", } }}
            inputProps={{ style: { textAlign: "center" } }}
            multiline
            placeholder={"E.g. Isn't Reveal awesome?"}
            // value={openingLine}
            // onChange={e => setOpeningLine(e.target.value)}
            fullWidth
            label="Tell people about your interests:"
            variant="standard"
        />
    );
};

export default InterestsInput;