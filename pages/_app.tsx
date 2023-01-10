import "../styles/global.css";
import { ContextProvider } from "../contexts/SocketContext/SocketContext";
import { Provider } from "react-redux";
import { store } from "../services/store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </Provider>
  );
}

export default MyApp