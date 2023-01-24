import { serverURL } from "./Server";

const Auth0Config = {
    authRequired: false,
    auth0Logout: true,
    secret: "060f790dd50e5d279e878b1a422223c40aa5877fe104afc35522a0ac271b4feb",
    baseURL: serverURL,
    clientID: 'APQrNE3IWbhv1f80N5J3nzIYQrCNTP4l',
    issuerBaseURL: 'https://dev-2hod9i-q.us.auth0.com'
};

export const SPA = {
    clientID: "LkAXxUTyqS7OKcMurzWpAFZnzGQN8Z5e",
    domain: "dev-2hod9i-q.us.auth0.com",
}

export default Auth0Config;