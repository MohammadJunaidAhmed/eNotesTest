import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import notesRoute from "./routes/notes";
import userRoutes from"./routes/users";
import morgan from "morgan"; 
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";


const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60* 1000 , //One hour 1ms* 1000 == 1s * 60 = 1min * 60 == 1hr;
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })
}));

app.use("/api/users", userRoutes);

app.use("/api/notes" ,notesRoute);


app.use((req, res, next) =>{
    next(createHttpError(404, "End point not found!"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.error(error);
    let errorMessge = "An Unknown error occured";
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessge = error.message; 
    }
    res.status(statusCode).json({error: errorMessge});
});


export default app;