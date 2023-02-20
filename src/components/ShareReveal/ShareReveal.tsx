import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon } from "react-share";
import { apis } from "../../../config/Server";
import { Divider } from "@mui/material";

const ShareReveal = () => {
    return (
        <div className="flex">
            <div className="mx-2">
                <FacebookShareButton url={apis.prod2}>
                    <FacebookIcon size={42} round={true} />
                </FacebookShareButton>
            </div>
            <div className="mx-2">
                <TwitterShareButton url={apis.prod2}>
                    <TwitterIcon size={42} round={true} />
                </TwitterShareButton>
            </div>
            <div className="mx-2">
                <WhatsappShareButton url={apis.prod2}>
                    <WhatsappIcon size={42} round={true} />
                </WhatsappShareButton>
            </div>
        </div>
    );
}

export default ShareReveal;