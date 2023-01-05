import { useContext, useState } from "react";
import { SocketContext } from '../contexts/SocketContext/SocketContext'

export default () => {
	const [IDToCall, setIDToCall] = useState<string>("");

	const context = useContext(SocketContext);

	return (
		<div>
			{
				context.stream &&
				<div style={{ border: "1px solid red" }}>
					<p>{ context.name }</p>
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
			{
				context.callAccepted && !context.callEnded &&
				<video playsInline muted ref={context.userVideo} autoPlay />
			}

			<div>
				<form>
					<input value={context.name} onChange={(e) => context.setName(e.target.value)}/>
					<p>{context.me}</p>
					<input value={IDToCall} onChange={(e) => setIDToCall(e.target.value)}/>
					{
						context.callAccepted && !context.callEnded ? (
							<button onClick={context.leaveCall}>
								Hang up
							</button>
						) : (
							<button onClick={() => context.callUser(IDToCall)}>
								Call
							</button>
						)
					}
				</form>
			</div>
		</div>
	)
}