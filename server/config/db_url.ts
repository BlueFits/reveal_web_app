enum AvailableENVs {
    DEV = "dev",
}

const db_url = {
    dev: "mongodb+srv://christianAdmin:mongopassword@cluster0.ubkpu.mongodb.net/reveal?retryWrites=true&w=majority"
};

export default db_url[AvailableENVs.DEV];