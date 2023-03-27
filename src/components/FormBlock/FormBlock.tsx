import { ChangeEventHandler } from "react";
import { Typography, TextField } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import { formColorPreLaunch } from "../../constants/ui/colors";
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: formColorPreLaunch.white,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: formColorPreLaunch.white,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: formColorPreLaunch.greyWhite,
        },
        '&:hover fieldset': {
            borderColor: formColorPreLaunch.greyWhite,
        },
        '&.Mui-focused fieldset': {
            borderColor: formColorPreLaunch.greyWhite,
        },
    },
});

interface IFormBlock {
    label: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    value: string;
    placeholder?: string;
    disableLabel?: boolean;
    textFieldSx?: any;
    textFieldInputLabelProps?: any;
    variation?: "default" | "white";
}

const FormBlock: React.FC<IFormBlock> = ({ label, onChange, value, placeholder, disableLabel = false, textFieldSx, textFieldInputLabelProps, variation = "default" }) => {
    return (
        <div>
            {!disableLabel && <Typography marginBottom={2} variant="h5">{label}</Typography>}
            {variation === "white" ? (
                <CssTextField
                    placeholder={placeholder || ""}
                    sx={textFieldSx || { marginBottom: "15px" }}
                    value={value}
                    onChange={onChange}
                    fullWidth
                    label={label}
                    variant="outlined"
                    InputLabelProps={textFieldInputLabelProps || {}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment sx={{ color: formColorPreLaunch.white }} position="start">
                                <EmailIcon color={"inherit"} />
                            </InputAdornment>
                        ),
                    }}
                />
            ) : (
                <TextField
                    placeholder={placeholder || ""}
                    sx={textFieldSx || { marginBottom: "15px" }}
                    value={value}
                    onChange={onChange}
                    fullWidth
                    label={label}
                    variant="outlined"
                    InputLabelProps={textFieldInputLabelProps || {}}
                />
            )}
        </div>
    );
};

export default FormBlock;