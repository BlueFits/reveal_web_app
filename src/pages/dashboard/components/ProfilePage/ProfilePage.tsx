import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const ProfilePage = () => {

    const { logout } = useAuth0();

    return (
        <div className="bg-orange-500 grow flex justify-center items-center">
            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</Button>
        </div>
    );
};

export default ProfilePage;