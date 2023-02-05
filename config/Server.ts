export enum status {
    development = "development",
    prod = "reveal-app",
    render = "render",
}

const apis = {};

apis[status.prod] = "https://www.reveal-app.site";
apis[status.render] = "https://reaveal-web-app.onrender.com/";
apis[status.development] = "http://localhost:3000";

export const currentENV = process.env.NODE_ENV === "production" ? status.prod : status.development;
export const serverURL = process.env.NODE_ENV === "production" ? apis[status.prod] : apis[status.development];
