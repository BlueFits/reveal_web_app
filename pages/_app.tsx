import "../styles/global.css";
import { ContextProvider } from "../contexts/SocketContext/SocketContext";

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
          <Component {...pageProps} />
    </ContextProvider>
  );
}

export default MyApp