import { useContext } from "react";
import { SocketContext } from '../contexts/SocketContext/SocketContext'

export default () => {
	const context = useContext(SocketContext);

	return (
		<div>
			{
				context.stream &&
				<div style={{ border: "1px solid red" }}>
					<video
						height={500}
						width={500}
						style={{ border: "2px solid blue" }}
						playsInline
						muted
						ref={context.myVid}
						autoPlay
					/>
				</div>
			}
			{/* {
				context.callAccepted && !context.callEnded &&
				<video playsInline muted ref={context.userVideo} autoPlay />
			} */}
		</div>
	)
}