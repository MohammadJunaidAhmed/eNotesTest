import app from "./app";
import mongoose from "mongoose";
import env from "./util/validateEnv"

const port = env.PORT; //Will be a number as we have used envalid. 

mongoose.connect(process.env.MONGO_CONNECTION_STRING!).then(() =>{
    console.log("Mongoose connected!");
    app.listen(port, ()=>{
        console.log("Server started on port " + port);
    })
})
.catch(console.error);

