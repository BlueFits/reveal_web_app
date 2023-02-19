import { Typography, Button, TextField, MenuItem, FormControl } from "@mui/material";
import { gender } from "../../../../server/Users/dto/users.dto";
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface IGenderForm {
    genderSelection: gender;
    handleSelectChange: (event: SelectChangeEvent) => void
}


const GenderForm: React.FC<IGenderForm> = ({ genderSelection, handleSelectChange }) => {
    return (
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
                <MenuItem value={gender.Gay}>Gay</MenuItem>
                <MenuItem value={gender.Lesbian}>Lesbian</MenuItem>
            </Select>
        </div>
    );
}

export default GenderForm;