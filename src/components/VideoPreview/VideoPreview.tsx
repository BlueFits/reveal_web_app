import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { Container, Avatar, Typography, CircularProgress } from "@mui/material"
import { IUserReducer } from "../../services/modules/User/userSlice";
import { apiTempUser } from "../../services/modules/otherUserSlice";
import InterestsChips from "../Interests/InterestsChips";
import { peerMsgInfo } from "../../pages/chat/constants/types";
import styles from "./VideoPreview.module.css";

interface IVideoPreview {
    user: IUserReducer | apiTempUser;
    videoRef?: MutableRefObject<HTMLVideoElement>;
    isMuted?: boolean;
    showAvatar?: boolean;
    skipped?: boolean;
    matched?: boolean;
    disableDisplay?: boolean;
    matchStatus?: boolean;
    callAccepted?: boolean;
    peerInfo?: string;
}


const VideoPreview: React.FC<IVideoPreview> = ({
    user, videoRef = null,
    isMuted = true,
    showAvatar = true,
    skipped = false,
    matched = false,
    disableDisplay = false,
    matchStatus = false,
    callAccepted = false,
    peerInfo = ""
}) => {
    const [localRef, setLocalRef] = useState(videoRef);
    const { username, avatar } = user;
    const [matchedDisplay, setMatchedDisplay] = useState(false);
    const [showReject, setShowReject] = useState(true);

    useEffect(() => {
        if (callAccepted && matchStatus) {
            setShowReject(false);
        }
    }, [matchStatus, callAccepted]);

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
        <Container sx={{ backgroundColor: "#000", zIndex: "11" }} disableGutters className="flex-1 relative overflow-hidden">

            {showReject &&
                <div className={`${skippedStyles.base} ${skipped ? skippedStyles.show : skippedStyles.hidden}`}>
                    <Typography fontWeight={"bold"} variant="h4" color={"#fff"}>REJECTED</Typography>
                </div>
            }

            <div className={`${matchedStyles.base} ${matchedDisplay ? matchedStyles.show : matchedStyles.hidden}`}>
                <Typography fontWeight={"bold"} variant="h4" color={"#fff"}>MATCHED</Typography>
            </div>

            <div className="p-2 absolute bg-black/50 w-2/4 flex rounded-full items-center" style={{ top: 30, left: 10 }}>
                <Avatar alt={`${!showAvatar ? (username && username.toLocaleUpperCase()) || "." : "."} avatar`} src={!showAvatar ? user.picture || user && user.auth0 && user.auth0.picture || null : "not set"} sx={{ marginRight: 3 }} />
                <p className="text-white">{showAvatar ? "..." : (username || "...")}</p>
            </div>

            {
                !user.username && !isMuted &&
                <div style={{ right: "40%", top: "45%" }} className={styles.centered_axis_x}>
                    {peerInfo !== peerMsgInfo.DISCONNECT &&
                        <CircularProgress style={{ color: "#fff" }} />
                    }
                    <Typography textAlign={"center"} marginTop={3} color={"#fff"} variant="body1">{peerInfo}</Typography>
                </div>
            }

            {
                !disableDisplay && showAvatar &&
                <div style={{ backgroundColor: avatar.bg }} className={`h-full w-full flex items-center justify-center`}>
                    <div className="flex flex-col w-3/4 items-center justify-center">
                        <Typography variant="h5" color={"#fff"}>
                            {avatar.display}
                        </Typography>
                        {user.opener && (
                            <Typography marginTop={2} variant="h6" color={"#fff"}>
                                {user.opener}
                            </Typography>
                        )}
                        {avatar.display && user.isTrial &&
                            <Typography marginTop={2} variant="h6" color={"#fff"}>
                                Trial User
                            </Typography>
                        }
                        {avatar.display && !user.isTrial && user.interests.length > 0 &&
                            <Typography marginTop={2} variant="h6" color={"#fff"}>
                                Here are some things I like
                            </Typography>
                        }
                        <div className="mt-5">
                            <InterestsChips
                                readOnly={true}
                                user={user}
                            />
                        </div>
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