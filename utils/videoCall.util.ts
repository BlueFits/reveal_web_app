import { apiTempUser } from "../services/modules/tempUserPoolSlice";

export const setupMediaStream = async (setStream) => {
    try {
        const ms = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        setStream(ms);
    } catch (e) {
        alert("Camera is disabled");
    }
};

export const genTempUserFromPool = (userArray: Array<apiTempUser>) => {
    const randomIndex = Math.floor(Math.random() * (userArray.length));
    return userArray[randomIndex];
};