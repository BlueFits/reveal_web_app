import { useState } from "react";
import Fab from '@mui/material/Fab';
import colors from '../../constants/ui/colors';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StepperFeedback from '../StepperFeedback/StepperFeedback';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import analyticEvents from "../../constants/analytics/analyticEvents";
import { TRACKING_ID } from "../../../config/GoogleAnalyticsConfig";

const FeedbackComponent = () => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const theme = useTheme();
    const notSm = useMediaQuery(theme.breakpoints.up('sm'));

    const feedbackCloseHandler = () => {
        setIsFeedbackOpen(false);
    };

    return (
        <>
            <Dialog fullScreen={!notSm} fullWidth open={isFeedbackOpen} onClose={feedbackCloseHandler}>
                <div className="flex justify-end px-3 pt-2">
                    <IconButton size="large" onClick={feedbackCloseHandler} aria-label="delete">
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </div>

                <DialogTitle variant="h5" marginBottom={2} textAlign={"center"}>Feedback</DialogTitle>
                <DialogContent>
                    <StepperFeedback
                        isFeedbackOpen={isFeedbackOpen}
                        feedbackCloseHandler={feedbackCloseHandler}
                    />
                </DialogContent>
            </Dialog>
            <div className='z-10 fixed right-[5%] bottom-[10%]'>
                <Fab
                    onClick={() => {
                        gtag("event", analyticEvents.CLICK.FEEDBACK_FAB, {
                            page_path: window.location.pathname,
                            send_to: TRACKING_ID,
                        });
                        setIsFeedbackOpen(true)
                    }}
                    style={{ borderRadius: 9999, backgroundColor: colors.primary }}
                    color="secondary"
                    size="large"
                    aria-label="add"
                >
                    <FeedbackIcon />
                </Fab>
            </div>
        </>
    );
};

export default FeedbackComponent;