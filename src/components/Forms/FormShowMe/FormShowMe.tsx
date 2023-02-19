import { Typography, Select, MenuItem } from "@mui/material";
import { gender } from "../../../../server/Users/dto/users.dto";

const FormShowMe = ({ value, onChange, hideTitle = false }) => {

    return (
        <div className="mb-4">
            {!hideTitle &&
                <Typography marginBottom={2} variant="h5">{"Interested in"}</Typography>
            }
            <Select
                fullWidth
                value={value}
                onChange={onChange}
            >
                <MenuItem value={gender.Male}>Male</MenuItem>
                <MenuItem value={gender.Female}>Female</MenuItem>
                <MenuItem value={gender.Gay}>Gay</MenuItem>
                <MenuItem value={gender.Lesbian}>Lesbian</MenuItem>
            </Select>
        </div>
    );
};

export default FormShowMe;