import express from "express"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"
import 'dotenv/config'
import {createServer} from 'http'

const app=express();
const httpServer = createServer(app);
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/user',userRoutes);


export default httpServer;