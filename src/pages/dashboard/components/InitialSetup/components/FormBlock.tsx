import { ChangeEventHandler } from "react";
import { Typography, TextField } from "@mui/material";

interface IFormBlock {
    label: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    value: string;
}

const FormBlock: React.FC<IFormBlock> = ({ label, onChange, value }) => {
    return (
        <div>
            <Typography marginBottom={2} variant="h5">{label}</Typography>
            <TextField sx={{ marginBottom: "15px" }} value={value} onChange={onChange} fullWidth label={label} variant="outlined" />
        </div>
    );
};

export default FormBlock;