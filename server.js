const app = require("./src/app");
require("dotenv").config();

const connectDb = require("./src/conf/db");

connectDb();



const LOG_TAG = "-->";

app.listen(process.env.PORT, () =>{
    console.log("Server is running on port 3000")
})

app.get("/", (req, res) => {
    res.send("Welcome to the Banking System API");
})


