import React from "react";
import { Typography, TextField } from "@mui/material";

interface IAdditionalFeedback {
    additionalFeedback: string;
    setAdditionalFeedback: (target) => void;
}

const AdditionalFeedback: React.FC<IAdditionalFeedback> = ({ additionalFeedback, setAdditionalFeedback }) => {
    return (
        <div className="mt-5">
            <Typography marginBottom={2}>Got an idea, suggestion, or additional feedback? Share it here!</Typography>
            <TextField
                value={additionalFeedback}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAdditionalFeedback(event.target.value);
                }}
                label="Additional Feedback"
                multiline
                rows={6}
                fullWidth
            />
        </div>
    );
};

export default AdditionalFeedback;