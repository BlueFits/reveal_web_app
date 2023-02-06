import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Alert } from "@mui/material"
import { useDispatch } from "react-redux";
import { setUsername, setPreference, setSocketID, setAvatar, IUserReducer, setOpener } from "../../../../services/modules/User/userSlice";
import { useRouter } from "next/router";
import socket from "../../../../../config/Socket";
import socketEmitters from "../../../../constants/emitters";

interface IPreChatPage {
	user: IUserReducer;
}

const PreChatPage: React.FC<IPreChatPage> = ({ user }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	// const [username, setLocalUsername] = useState<string>("");
	// const [preference, setLocalPreference] = useState<string>("");
	const [openingLine, setOpeningLine] = useState<string>("");
	const [hasErrors, setHasErrors] = useState<boolean>(false);

	useEffect(() => {
		socket.emit(socketEmitters.REQUEST_ID)
		socket.on(socketEmitters.ME, (socketID: string) => {
			dispatch(setSocketID(socketID));
		})
	}, []);

	const onStartHandler = async () => {
		//Basic Sanitation
		// if (preference.length <= 0) {
		// 	setHasErrors(true);
		// 	return;
		// }
		// const preferenceArr: Array<string> = preference.replace(/ /g, '').split(",");
		// dispatch(setUsername(user.username));
		// dispatch(setPreference(preferenceArr));
		dispatch(setOpener(openingLine));
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
			<Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				{/* <Typography variant="h4" gutterBottom>
					Start Chatting
				</Typography> */}
				<Typography variant="h5" gutterBottom>
					Write an opener!
				</Typography>
				{/* <TextField sx={{ marginBottom: "15px" }} value={username} onChange={e => setLocalUsername(e.target.value)} fullWidth label="display name" variant="outlined" /> */}
				{/* <TextField value={preference} onChange={e => setLocalPreference(e.target.value)} fullWidth label="preference" variant="outlined" /> */}
				<div className="w-3/4 lg:max-w-lg">
					<TextField
						multiline
						placeholder={"E.g. Hey what's your name? You can call me yours."}
						value={openingLine}
						onChange={e => setOpeningLine(e.target.value)}
						fullWidth
						label="Write here:"
						variant="standard"
					/>
					<Button
						fullWidth
						onClick={onStartHandler}
						color="secondary"

						style={{ borderRadius: 9999, borderWidth: 2 }}
						sx={{ color: "#9b59b6", margin: "15px 0" }}
						variant="outlined"
					>
						Start
					</Button>
				</div>
				{hasErrors && <Alert severity="error">Invalid Fields</Alert>}
			</Container>
		</Container>
	)
}

export default PreChatPage;