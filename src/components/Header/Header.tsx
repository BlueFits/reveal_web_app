import { Typography, IconButton } from "@mui/material";
import { ReactNode } from "react";

interface IHeader {
    icon: ReactNode,
    headerButtonOnClick: () => any;
}

const Header: React.FC<IHeader> = ({ icon, headerButtonOnClick }) => {

    return (
        <div className="px-3 py-2 flex justify-between items-center bg-gradient-to-b from-black ">
            <Typography fontWeight="bold" color="#fff" variant="h5">
                Reveal
            </Typography>

            <IconButton onClick={headerButtonOnClick} size="large">
                {icon}
            </IconButton>
        </div>
    );
};

export default Header;