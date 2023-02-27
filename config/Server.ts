export enum status {
    development = "development",
    prod = "prod",
    render = "render",
    prod2 = "prod2",
    qa = "qa",
}

export const apis: {
    development: string;
    prod: string,
    prod2: string,
    render: string
    qa: string,
} = {
    prod: "https://www.reveal-app.site",
    development: "http://localhost:3000",
    render: "https://reaveal-web-app.onrender.com",
    prod2: "https://reveal-app.co",
    qa: "https://qa-reveal-app.onrender.com",
};

export const currentENV = process.env.NODE_ENV === "production" ? status.prod2 : status.development;
// export const serverURL = process.env.NODE_ENV === "production" ? apis[status.prod2] : apis[status.development];

const serverURLConfig = () => {
    const QA_URL = process.env.RENDER_EXTERNAL_HOSTNAME;
    console.log("$$$", QA_URL);
    if (QA_URL) {
        return apis[status.qa]
    } else {
        return process.env.NODE_ENV === "production" ? apis[status.prod2] : apis[status.development]
    }
}

console.log("server Config", serverURLConfig());

export const serverURL = serverURLConfig();
