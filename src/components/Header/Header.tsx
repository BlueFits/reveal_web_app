import { Typography, IconButton } from "@mui/material";
import { ReactNode } from "react";
import Link from 'next/link'

interface IHeader {
    icon?: ReactNode,
    headerButtonOnClick: () => any;
    disableIcon?: boolean;
}

const Header: React.FC<IHeader> = ({ icon, headerButtonOnClick, disableIcon = false }) => {

    return (
        <div className="px-4 py-4 flex justify-between items-center bg-gradient-to-b from-black ">
            <Link href="/">
                <Typography fontWeight="bold" color="#fff" variant="h5">
                    Reveal
                </Typography>
            </Link>

            {
                !disableIcon &&
                <IconButton onClick={headerButtonOnClick} size="large">
                    {icon}
                </IconButton>
            }
        </div>
    );
};

export default Header;