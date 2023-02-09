import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { Container, Avatar, Typography, CircularProgress } from "@mui/material"
import { IUserReducer } from "../../services/modules/User/userSlice";
import { apiTempUser } from "../../services/modules/otherUserSlice";

interface IVideoPreview {
    user: IUserReducer | apiTempUser;
    videoRef?: MutableRefObject<HTMLVideoElement>;
    isMuted?: boolean;
    showAvatar?: boolean;
    skipped?: boolean;
    matched?: boolean;
    disableDisplay?: boolean;
    matchStatus?: boolean;
}


const VideoPreview: React.FC<IVideoPreview> = ({
    user, videoRef = null,
    isMuted = true,
    showAvatar = true,
    skipped = false,
    matched = false,
    disableDisplay = false,
    matchStatus = false,
}) => {
    const [localRef, setLocalRef] = useState(videoRef);
    const { username, avatar } = user;
    const [matchedDisplay, setMatchedDisplay] = useState(false);

    useEffect(() => {
        if (matched) {
            setMatchedDisplay(true);
            setTimeout(() => {
                setMatchedDisplay(false);
            }, 2000);
        }
    }, [matched]);

    useEffect(() => {
        setLocalRef(videoRef)
    }, [videoRef.current]);

    const skippedStyles = {
        base: `ease-in-out duration-500 h-full w-full absolute flex justify-center items-center bg-red-700/70`,
        show: `opacity-1 z-10`,
        hidden: `opacity-0 -z-10`,
    }

    const matchedStyles = {
        base: `ease-in-out duration-500 h-full w-full absolute flex justify-center items-center bg-green-600/70`,
        show: `opacity-1 z-10`,
        hidden: `opacity-0 -z-10`,
    }

    return (
        <Container sx={{ backgroundColor: "#000" }} disableGutters className="flex-1 relative overflow-hidden">


            {!matchStatus &&
                <div className={`${skippedStyles.base} ${skipped ? skippedStyles.show : skippedStyles.hidden}`}>
                    <Typography fontWeight={"bold"} variant="h4" color={"#fff"}>REJECTED</Typography>
                </div>
            }

            <div className={`${matchedStyles.base} ${matchedDisplay ? matchedStyles.show : matchedStyles.hidden}`}>
                <Typography fontWeight={"bold"} variant="h4" color={"#fff"}>MATCHED</Typography>
            </div>

            <div className="p-2 absolute bg-black/50 w-2/4 flex rounded-full items-center" style={{ top: 30, left: 10 }}>
                <Avatar alt={`${!showAvatar ? username && username.toLocaleUpperCase() : "."} avatar`} src="/static/images/avatar/1.jpg" sx={{ marginRight: 3 }} />
                <p className="text-white">{showAvatar ? "..." : username}</p>
            </div>
            {
                !user.username &&
                <div style={{ right: "50%", top: "50%" }} className="absolute">
                    <CircularProgress color="primary" />
                </div>
            }
            {
                !disableDisplay && showAvatar &&
                <div style={{ backgroundColor: avatar.bg }} className={`h-full w-full flex items-center justify-center`}>
                    <div className="flex flex-col w-3/4 items-center justify-center">
                        <Typography variant="h4" color={"#fff"}>
                            {avatar.display}
                        </Typography>
                        {user.opener && (
                            <Typography marginTop={2} variant="h6" color={"#fff"}>
                                {user.opener}
                            </Typography>
                        )}
                    </div>
                </div>
            }
            <video
                style={{ background: "black", height: "100%", width: "100%", objectFit: "cover" }}
                playsInline
                muted={isMuted}
                autoPlay
                ref={localRef}
            />
        </Container>
    );
};

export default VideoPreview;