import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Alert } from "@mui/material"
import { useDispatch } from "react-redux";
import { setUsername, setPreference, setSocketID, setAvatar, IUserReducer } from "../../../../services/modules/User/userSlice";
import { useRouter } from "next/router";
import socket from "../../../../../config/Socket";
import { socketEmitters } from "../../../../constants/emitters";

interface IPreChatPage {
	user: IUserReducer;
}

const PreChatPage: React.FC<IPreChatPage> = ({ user }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const [username, setLocalUsername] = useState<string>("");
	const [preference, setLocalPreference] = useState<string>("");
	const [hasErrors, setHasErrors] = useState<boolean>(false);

	useEffect(() => {
		socket.emit(socketEmitters.REQUEST_ID)
		socket.on(socketEmitters.ME, (socketID: string) => {
			dispatch(setSocketID(socketID));
		})
	}, []);


	const onStartHandler = async () => {
		//Basic Sanitation
		if (preference.length <= 0) {
			setHasErrors(true);
			return;
		}
		const preferenceArr: Array<string> = preference.replace(/ /g, '').split(",");
		dispatch(setUsername(user.username));
		dispatch(setPreference(preferenceArr));
		dispatch(setAvatar());
		router.push("/chat");
	};

	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "coloumn"
			}}
			className="h-full"
			maxWidth="lg"
		>
			<Container>
				<Typography variant="h5" gutterBottom>
					Enter a topic
				</Typography>
				{/* <TextField sx={{ marginBottom: "15px" }} value={username} onChange={e => setLocalUsername(e.target.value)} fullWidth label="display name" variant="outlined" /> */}
				<TextField value={preference} onChange={e => setLocalPreference(e.target.value)} fullWidth label="preference" variant="outlined" />
				<Button onClick={onStartHandler} color="secondary" sx={{ margin: "15px 0" }} variant="outlined">Start</Button>
				{hasErrors && <Alert severity="error">Invalid Fields</Alert>}
			</Container>
		</Container>
	)
}

export default PreChatPage;