import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Alert } from "@mui/material"
import { useDispatch } from "react-redux";
import { setUsername, setPreference, setSocketID, setAvatar, IUserReducer, setOpener } from "../../../../services/modules/User/userSlice";
import { useRouter } from "next/router";
import socket from "../../../../../config/Socket";
import socketEmitters from "../../../../constants/emitters";
import { useSelector } from "react-redux";
import { IliveCountReducer, updateCount } from "../../../../services/modules/LiveCount/LiveCount";
import { IReducer } from "../../../../services/store";
import colors from "../../../../constants/colors";
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Divider } from "@mui/material";

interface IPreChatPage {
	user: IUserReducer;
}

const PreChatPage: React.FC<IPreChatPage> = ({ user }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const liveCountReducer: IliveCountReducer = useSelector((state: IReducer) => state.liveCount);

	// const [username, setLocalUsername] = useState<string>("");
	// const [preference, setLocalPreference] = useState<string>("");
	const [openingLine, setOpeningLine] = useState<string>("");
	const [hasErrors, setHasErrors] = useState<boolean>(false);
	const [checked, setChecked] = useState(false);
	const [chatType, setChatType] = useState<string>("0");

	useEffect(() => {
		socket.off(socketEmitters.SOCKET_ROOM_WATCH, (count) => {
			dispatch(updateCount(count))
		});
		socket.on(socketEmitters.SOCKET_ROOM_WATCH, (count) => {
			dispatch(updateCount(count))
		});
	}, [liveCountReducer]);

	useEffect(() => {
		socket.emit(socketEmitters.SOCKET_ROOM_GET);
		socket.emit(socketEmitters.REQUEST_ID)
		socket.once(socketEmitters.ME, (socketID: string) => {
			dispatch(setSocketID(socketID));
		})
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

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
		router.push({
			pathname: "/chat",
			query: { chatType }
		});
	};

	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexDirection: "column"
			}}
			className="h-full"
			maxWidth="lg"
		>
			<div className="flex-1">
				{/* Placeholder */}
			</div>
			<Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
				<Typography variant="h4" gutterBottom>
					Start Chatting
				</Typography>
				<Typography textAlign={"center"} variant="body1" gutterBottom>
					<span style={{ color: colors.primary }} className="font-semibold">{liveCountReducer.liveCount || 0}</span> people waiting to talk.
				</Typography>
				{/* <TextField sx={{ marginBottom: "15px" }} value={username} onChange={e => setLocalUsername(e.target.value)} fullWidth label="display name" variant="outlined" /> */}
				{/* <TextField value={preference} onChange={e => setLocalPreference(e.target.value)} fullWidth label="preference" variant="outlined" /> */}
				<div className="w-3/4 lg:max-w-lg mt-3">
					<TextField
						// InputLabelProps={{ style: { textAlign: "center", width: "100%", } }}
						inputProps={{ style: { textAlign: "center" } }}
						multiline
						placeholder={"E.g. Hey what's your name? You can call me yours."}
						value={openingLine}
						onChange={e => setOpeningLine(e.target.value)}
						fullWidth
						label="Write an opener here:"
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
					{hasErrors && <Alert severity="error">Invalid Fields</Alert>}
				</div>
			</Container>
			<div className="flex-1 w-3/5">
				{/* <Divider sx={{ marginBottom: 2 }} /> */}
				<Typography textAlign={"center"} variant="body2" gutterBottom>Additional Settings</Typography>
				<div className="mt-6 flex flex-col justify-center items-center">
					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel size="small" color="secondary">Chat Type</InputLabel>
						<Select
							SelectDisplayProps={{ style: { borderRadius: 9999 } }}
							style={{ borderRadius: 9999, textAlign: "center" }}
							size="small"
							color="secondary"
							value={chatType}
							label="Chat Type"
							onChange={(e: SelectChangeEvent) => setChatType(e.target.value)}
						>
							<MenuItem value={"0"}>Normal</MenuItem>
							<MenuItem value={"1"}>Open</MenuItem>
						</Select>
						<FormHelperText>Select your chat type</FormHelperText>
					</FormControl>
				</div>
			</div>
		</Container>
	)
}

export default PreChatPage;