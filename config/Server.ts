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
    qa: "https://reveal-web-app.vercel.app",
};

export const currentENV = process.env.NODE_ENV === "production" ? status.prod2 : status.development;
// export const serverURL = process.env.NODE_ENV === "production" ? apis[status.prod2] : apis[status.development];

const serverURLConfig = () => {

    console.log(process.env.NEXT_PUBLIC_VERCEL_ENV);
    console.log(process.env.NEXT_PUBLIC_VERCEL_URL);


    switch (process.env.NODE_ENV) {
        case "production":
            return apis[status.prod2];
        case "test":
            return apis[status.qa];
        case "development":
            return apis[status.development];
        default:
            return apis[status.development]
    }
}

console.log("NODE_ENV", process.env.NODE_ENV);
console.log("ServerURL Config", serverURLConfig());

export const serverURL = serverURLConfig();
