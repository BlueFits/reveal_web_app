import "../styles/global.css";
import { Provider } from "react-redux";
import { store } from "../services/store";
import Head from "next/head";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth0Provider } from "@auth0/auth0-react";
import { SPA } from "../../config/Auth0.config";
import { serverURL } from "../../config/Server";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GoogleAnalytics from "../components/GoogleAnalytics/GoogleAnalytics";

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
    light: Palette["primary"];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
    light: Palette["primary"];
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

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
    light: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#da0077',
      darker: '#053e85',
    },
    neutral: {
      main: '#fff',
      contrastText: '#fff',
    },
    light: {
      main: '#fff',
      contrastText: '#fff',
      dark: "#fff",
      light: "#fff",
    },
    secondary: {
      main: "#da0077"
    }
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <GoogleAnalytics />
              <Component {...pageProps} />
            </ThemeProvider>
          </Provider>
        </Auth0Provider>
      </LocalizationProvider>
    </>
  );
}

export default MyApp