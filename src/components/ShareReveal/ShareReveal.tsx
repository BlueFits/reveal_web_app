import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon } from "react-share";
import { apis } from "../../../config/Server";
import IconButton from '@mui/material/IconButton';

const ShareReveal = () => {
    return (
        <div className="flex">
            <FacebookShareButton url={apis.prod}>
                <IconButton>
                    <FacebookIcon size={42} round={true} />
                </IconButton>
            </FacebookShareButton>
            <TwitterShareButton url={apis.prod}>
                <IconButton>
                    <TwitterIcon size={42} round={true} />
                </IconButton>
            </TwitterShareButton>
            <WhatsappShareButton url={apis.prod}>
                <IconButton>
                    <WhatsappIcon size={42} round={true} />
                </IconButton>
            </WhatsappShareButton>
        </div>
    );
}

export default ShareReveal;