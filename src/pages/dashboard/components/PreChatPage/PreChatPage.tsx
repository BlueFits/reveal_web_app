import { useEffect, useState, useCallback } from "react";
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
import PickupLines from "../../../../constants/pickupLines";
import { TRACKING_ID } from "../../../../../config/GoogleAnalyticsConfig";
import InterestsInput from "../../../../components/Interests/InterestsInput";
import InterestsChips from "../../../../components/Interests/InterestsChips";


interface IPreChatPage {
	user: IUserReducer;
}

enum IChatType {
	NORMAL = "0",
	OPEN = "1",
}

const PreChatPage: React.FC<IPreChatPage> = ({ user }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const liveCountReducer: IliveCountReducer = useSelector((state: IReducer) => state.liveCount);
	const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);

	// const [username, setLocalUsername] = useState<string>("");
	// const [preference, setLocalPreference] = useState<string>("");
	const [openingLine, setOpeningLine] = useState<string>("");
	const [hasErrors, setHasErrors] = useState<boolean>(false);
	const [chatType, setChatType] = useState<IChatType>(IChatType.NORMAL);
	// const [pickupLine, setPickupLine] = useState(PickupLines.random());

	//Google Analytics

	useEffect(() => {
		gtag("event", "pre-chat-focus", {
			page_path: window.location.pathname,
			send_to: TRACKING_ID,
		});
	}, []);

	const pickupLine = useCallback(() => {
		if (chatType === "0") {
			return PickupLines.random();
		}
	}, [chatType]);

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
			<div className="flex-1">{/* Placeholder */}</div>

			<Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
				<Typography variant="h4" gutterBottom>
					Start Chatting
				</Typography>
				<Typography textAlign={"center"} variant="subtitle1" gutterBottom>
					<span style={{ color: colors.primary }} className="font-bold">{liveCountReducer.liveCount || 0}</span> people waiting to talk.
				</Typography>
				{/* <TextField sx={{ marginBottom: "15px" }} value={username} onChange={e => setLocalUsername(e.target.value)} fullWidth label="display name" variant="outlined" /> */}
				{/* <TextField value={preference} onChange={e => setLocalPreference(e.target.value)} fullWidth label="preference" variant="outlined" /> */}
				<div className="w-3/4 lg:max-w-lg mt-3 flex flex-col justify-center items-center">
					{/* <TextField
						// InputLabelProps={{ style: { textAlign: "center", width: "100%", } }}
						inputProps={{ style: { textAlign: "center" } }}
						multiline
						placeholder={chatType === "0" ? `E.g. ${pickupLine()}` : "E.g. Isn't Reveal awesome?"}
						value={openingLine}
						onChange={e => setOpeningLine(e.target.value)}
						fullWidth
						label="Write an opener here:"
						variant="standard"
					/> */}
					<InterestsInput />
					<InterestsChips
						user={userReducer}
					/>

					<Button
						// disabled
						className="global_bttn_width"
						fullWidth
						onClick={onStartHandler}
						sx={{ margin: "15px 0" }}
						variant="contained"
						size="large"
						disableElevation
						style={{ borderRadius: 9999, backgroundColor: colors.primary }}
						color="secondary"
					>
						Start
					</Button>
					{/* <Alert sx={{ marginBottom: 2 }} severity="info">
						Chat is currently disabled, please check back on the launch date (February 22, 2023).
					</Alert> */}
					{hasErrors && <Alert severity="error">Invalid Fields</Alert>}
				</div>
			</Container>
			<div className="flex-1 w-3/5">
				{/* <Divider sx={{ marginBottom: 2 }} /> */}
				<Typography textAlign={"center"} variant="body2" gutterBottom>Additional Settings</Typography>
				<div className="mt-6 flex flex-col justify-center items-center">
					<FormControl sx={{ maxWidth: "200px" }}>
						<InputLabel size="small" color="secondary">Chat Type</InputLabel>
						<Select
							SelectDisplayProps={{ style: { borderRadius: 9999 } }}
							style={{ borderRadius: 9999, textAlign: "center" }}
							size="small"
							color="secondary"
							value={chatType}
							label="Chat Type"
							onChange={(e: SelectChangeEvent) => setChatType((e.target.value as IChatType))}
						>
							<MenuItem value={IChatType.NORMAL}>Normal</MenuItem>
							<MenuItem value={IChatType.OPEN}>Open</MenuItem>
						</Select>
						<FormHelperText>
							<span className="mt-3 flex flex-col text-center">
								<span>*Normal - connect with the opposite gender</span>
								<span className="mt-2">*Open - connect to anyone for fun</span>
							</span>
						</FormHelperText>
					</FormControl>
				</div>
			</div>
		</Container>
	)
}

export default PreChatPage;