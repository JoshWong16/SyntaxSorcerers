import app from './src/app.js';
import dotenv  from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 8080;

/* ChatGPT usage: No */
const server = app.listen(PORT, async (error) => {
        if(!error) {
            console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        } else 
            console.log("Error occurred, server can't start", error);
    }
);

export default server;