import express from 'express';
import cors from 'cors';
import { sequelize } from "./db";
import dotenv from 'dotenv';
import UserAuthController from '../src/controllers/UserAuthController'
import {Router} from "express";
import routes from "./routes/index";
import {User} from "./Models/User";

// @ts-ignore
const router : any = new Router();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api',routes)
app.use('/api/reg', async (req, res) =>{
    const user = await User.findAll()
    res.send(user)

})



sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));


sequelize.sync({ alter: true })
    .then(() => console.log('Models synchronized with database'))
    .catch(err => console.error('Sync error:', err));



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});