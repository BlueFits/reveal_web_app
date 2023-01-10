import { Container, Typography, TextField, Button } from "@mui/material"

export default () => {
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
				<TextField fullWidth label="preference" variant="outlined" />
				<Button color="secondary" sx={{ margin: "15px 0" }} variant="outlined">Start</Button>
			</Container>
		</Container>
	)
}