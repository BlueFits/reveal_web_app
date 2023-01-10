import { Container, Typography, TextField, Button } from "@mui/material"

export default () => {
	return (
		<Container className="flex justify-center items-center h-screen flex-col" maxWidth="lg">
			<Container>
				<Typography variant="h5" gutterBottom>
					Enter a topic
				</Typography>
				<TextField fullWidth label="preference" variant="outlined" />
				<Button color="secondary" className="my-4" variant="outlined">Start</Button>
			</Container>
		</Container>
	)
}