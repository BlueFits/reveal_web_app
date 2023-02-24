import { serverURL } from "./Server";

const Auth0ENV = {
    dev: {
        authRequired: false,
        auth0Logout: true,
        secret: "060f790dd50e5d279e878b1a422223c40aa5877fe104afc35522a0ac271b4feb",
        baseURL: serverURL,
        clientID: 'APQrNE3IWbhv1f80N5J3nzIYQrCNTP4l',
        issuerBaseURL: 'https://dev-2hod9i-q.us.auth0.com'
    },
    prod: {
        authRequired: false,
        auth0Logout: true,
        secret: '060f790dd50e5d279e878b1a422223c40aa5877fe104afc35522a0ac271b4feb',
        baseURL: serverURL,
        clientID: '1Nk4gvEyH5ucrlsOruzoehQNu16eIcOf',
        issuerBaseURL: 'https://prod-reveal-app.us.auth0.com'
    },
};

const Auth0Config = (process.env.NODE_ENV !== "production") || (process.env.NEXT_PUBLIC_VERCEL_URL) ? Auth0ENV.dev : Auth0ENV.prod;

const SPACofig = {
    dev: {
        clientID: "LkAXxUTyqS7OKcMurzWpAFZnzGQN8Z5e",
        domain: "dev-2hod9i-q.us.auth0.com",
    },
    prod: {
        clientID: "F48rxivIKro5qEu5spufE2j90vxH8dmD",
        domain: "prod-reveal-app.us.auth0.com",
    }
}

export const SPA = (process.env.NODE_ENV !== "production") || (process.env.NEXT_PUBLIC_VERCEL_URL) ? SPACofig.dev : SPACofig.prod;

export default Auth0Config;