import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserByAuthID, IUserReducer } from "../../services/modules/User/userSlice";
import { IReducer } from "../../services/store";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Person } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import PreChatPage from "./components/PreChatPage/PreChatPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import VideoChatIcon from '@mui/icons-material/VideoChat';
import Loading from "../../components/Loading/Loading";

const MuiBottomNavigationAction = styled(BottomNavigationAction)(`
  &.Mui-selected {
    color: #9b59b6;
  }
`);

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        console.log(isLoading);
        const init = async () => {
            if (!user) router.push("/");
            if (user && user.sub) {
                const response = await dispatch(getUserByAuthID(user.sub));
                console.log(response);
                if (response.payload && !response.payload.gender) router.push("/setup");
            }
        }
        if (!isLoading) init();
    }, [user, isLoading]);

    if (isLoading) return (<Loading />);

    return (
        isAuthenticated && !userReducer.isFirstTime ? (
            <div className="h-screen w-screen flex flex-col justify-between">
                {value === 0 &&
                    <div className="grow">
                        <PreChatPage
                            user={userReducer}
                        />
                    </div>
                }
                {/* {value === 1 &&
                    <div className="bg-red-500 grow">

                    </div>
                } */}
                {value === 1 &&
                    <ProfilePage />
                }
                <Box sx={{ width: "100%" }}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <MuiBottomNavigationAction label="Chat" icon={<VideoChatIcon />} />
                        {/* <MuiBottomNavigationAction label="Favorites" icon={<Favorite />} /> */}
                        <MuiBottomNavigationAction label="Profile" icon={<Person />} />
                    </BottomNavigation>
                </Box>
            </div>
        ) : (
            <Loading />
        )
    );
};

export default Index;