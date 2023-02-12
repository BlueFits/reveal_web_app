export enum status {
    development = "development",
    prod = "prod",
    render = "render",
}

export const apis: {
    development: string;
    prod: string
    render: string
} = {
    prod: "https://www.reveal-app.site",
    development: "http://localhost:3000",
    render: "https://reaveal-web-app.onrender.com",
};

export const currentENV = process.env.NODE_ENV === "production" ? status.prod : status.development;
export const serverURL = process.env.NODE_ENV === "production" ? apis[status.prod] : apis[status.development];
