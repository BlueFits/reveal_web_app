import * as React from 'react';
import Typography from '@mui/material/Typography';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons: {
    [index: string]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon fontSize='large' color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon fontSize='large' color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon fontSize='large' color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon fontSize='large' color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon fontSize='large' color="success" />,
        label: 'Very Satisfied',
    },
};


function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}


const ExperienceForm = ({ value, setValue, radioValue, setRadioValue }) => {

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioValue((event.target as HTMLInputElement).value);
    };

    return (
        <>
            <Typography marginBottom={2} fontWeight={"bold"} component="legend">How is your experience with Reveal?</Typography>
            <StyledRating
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                value={value}
                IconContainerComponent={IconContainer}
                getLabelText={(value: number) => customIcons[value].label}
                highlightSelectedOnly
            />
            <div className='mt-10 flex flex-col justify-center items-center'>
                {/* <Typography
                    textAlign={"center"}
                    marginBottom={2}
                    fontWeight={"bold"}
                    component="legend"
                >
                    What went wrong?
                </Typography> */}
                <Typography
                    textAlign={"center"}
                    marginBottom={2}
                    component="legend"
                    variant='body2'
                >
                    How likely are you to recommend us to a friend?
                </Typography>

                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={radioValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value={0} control={<Radio />} label="Not at all likely" />
                        <FormControlLabel value={1} control={<Radio />} label="Maybe, it depends" />
                        <FormControlLabel value={2} control={<Radio />} label="I definitely would" />
                    </RadioGroup>
                </FormControl>
            </div>
        </>
    );
};

export default ExperienceForm;