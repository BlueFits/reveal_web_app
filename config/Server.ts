const apis = {
    render: "https://qa-thegamerstory.herokuapp.com",
    development: "http://localhost:3000",
};
export const currentENV = "development";
export const serverURL = apis[currentENV];