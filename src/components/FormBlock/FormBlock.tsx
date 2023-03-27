import { ChangeEventHandler } from "react";
import { Typography, TextField } from "@mui/material";

interface IFormBlock {
    label: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    value: string;
    placeholder?: string;
    disableLabel?: boolean;
    textFieldSx?: any;
}

const FormBlock: React.FC<IFormBlock> = ({ label, onChange, value, placeholder, disableLabel = false, textFieldSx }) => {
    return (
        <div>
            {!disableLabel && <Typography marginBottom={2} variant="h5">{label}</Typography>}
            <TextField
                placeholder={placeholder || ""}
                sx={textFieldSx ? textFieldSx : { marginBottom: "15px" }}
                value={value}
                onChange={onChange}
                fullWidth
                label={label}
                variant="outlined"
            />
        </div>
    );
};

export default FormBlock;