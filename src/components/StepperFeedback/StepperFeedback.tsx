import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExperienceForm from './components/ExperienceForm';
import AdditionalFeedback from './components/AdditionalFeedback';
import { useSelector, useDispatch } from 'react-redux';
import { IFeedback, createFeedback } from '../../services/modules/Feedback/Feedback';
import { IReducer } from '../../services/store';

const steps = ['Tell us about your experience', 'Additional feedbacks'];


export default function HorizontalLinearStepper({ isFeedbackOpen, feedbackCloseHandler }) {
    const dispatch = useDispatch();
    const feedbackReducer: IFeedback = useSelector((state: IReducer) => state.feedback);
    const [experienceValue, setExperienceValue] = React.useState<number | null>(null);
    const [recommendationValue, setRecommendationValue] = React.useState<string | null>(null);
    const [additionalFeedback, setAdditionalFeedback] = React.useState<string>("");
    const [activeStep, setActiveStep] = React.useState<number>(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    // React.useEffect(() => {
    //     console.log("Fedback Reducer", feedbackReducer);
    // }, [feedbackReducer]);

    const isStepOptional = (step: number) => {
        return step === 2;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);

        if (activeStep === steps.length - 1) {
            console.log("Submitting Form");
            console.log(experienceValue, parseInt(recommendationValue), additionalFeedback);
            let data: IFeedback = {
                experience: experienceValue,
                wouldRecommend: parseInt(recommendationValue),
                additionalFeedback,
            };
            dispatch(createFeedback(data))
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <div className='mt-10 text-center'>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Thanks for your feedback.
                        </Typography>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={feedbackCloseHandler}>Close</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='my-5 flex flex-col justify-center items-center'>
                        {activeStep === 0 &&
                            <ExperienceForm
                                radioValue={recommendationValue}
                                setRadioValue={setRecommendationValue}
                                setValue={setExperienceValue}
                                value={experienceValue}
                            />
                        }
                        {activeStep === 1 &&
                            <AdditionalFeedback
                                additionalFeedback={additionalFeedback}
                                setAdditionalFeedback={setAdditionalFeedback}
                            />
                        }
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}
                        <Button disabled={!experienceValue || !recommendationValue} onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}