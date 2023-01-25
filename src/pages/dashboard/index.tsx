import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserByAuthID, IUserReducer } from "../../services/modules/userSlice";
import { IReducer } from "../../services/store";
import InitialSetup from "./components/InitialSetup/InitialSetup";

const Index = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const { user, isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
        console.log(isAuthenticated);
        if (user && user.sub) dispatch(getUserByAuthID(user.sub));
    }, [user, isAuthenticated]);

    useEffect(() => {
        if (!userReducer.isFirstTime) console.log("run setup for user");
    }, [userReducer]);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (!isAuthenticated) window.location.href = "/";

    return (
        isAuthenticated ?
            (!userReducer.isFirstTime ? (
                <div>
                    <img src={user.picture} alt={user.name} />
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ) : (
                <InitialSetup />
            )) :
            (
                <p>loading</p>
            )
    );
};

export default Index;