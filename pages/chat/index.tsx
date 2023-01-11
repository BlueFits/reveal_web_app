import { ContextProvider } from "../../contexts/SocketContext/SocketContext";
import Chat from "../../components/Chat/Chat";

export default () => {
    return (
        <ContextProvider>
            <Chat />
        </ContextProvider>
    );
};