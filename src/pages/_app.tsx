import "../styles/global.css";
import { Provider } from "react-redux";
import { store } from "../services/store";
import Head from "next/head";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth0Provider } from "@auth0/auth0-react";
import Auth0Config, { SPA } from "../../config/Auth0.config";
import { serverURL } from "../../config/Server";

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
}

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#fff',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    secondary: {
      main: "#0971f1"
    }
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Auth0Provider
        domain={SPA.domain}
        clientId={SPA.clientID}
        authorizationParams={{
          redirect_uri: serverURL + "/dashboard",
        }}
      >
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </Auth0Provider>
    </>
  );
}

export default MyApp