import { useState } from "react";
import { Container, Typography, TextField, Button, Alert } from "@mui/material"
import { useDispatch } from "react-redux";
import { setUsername, setPreference } from "../services/modules/userSlice";
import { useRouter } from "next/router";

export default () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const [username, setLocalUsername] = useState<string>("");
	const [preference, setLocalPreference] = useState<string>("");
	const [hasErrors, setHasErrors] = useState<boolean>(false);


	const onStartHandler = async () => {
		//Basic Sanitation
		if (username.length <= 0 || preference.length <= 0) {
			setHasErrors(true);
			return;
		}
		const preferenceArr: Array<string> = preference.replace(/ /g, '').split(",");
		dispatch(setUsername(username));
		dispatch(setPreference(preferenceArr));
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
			className="h-screen"
			maxWidth="lg"
		>
			<Container>
				<Typography variant="h5" gutterBottom>
					Enter a topic
				</Typography>
				<TextField sx={{ marginBottom: "15px" }} value={username} onChange={e => setLocalUsername(e.target.value)} fullWidth label="display name" variant="outlined" />
				<TextField value={preference} onChange={e => setLocalPreference(e.target.value)} fullWidth label="preference" variant="outlined" />
				<Button onClick={onStartHandler} color="secondary" sx={{ margin: "15px 0" }} variant="outlined">Start</Button>
				{hasErrors && <Alert severity="error">Invalid Fields</Alert>}
			</Container>
		</Container>
	)
}