import AuthenticateJWT from "../middlewares/AuthenticateJWT";
import {Router} from 'express'
const routes = Router();


import UserAuthController from '../controllers/UserAuthController'
import UserFilterController from "../controllers/UserFilterController";

routes.post("/reg", UserAuthController.registerUser);
routes.post("/log", UserAuthController.loginUser);

routes.post("/getusers", AuthenticateJWT, UserFilterController.GetAllUsers); // Get all users
routes.post("/getuser", AuthenticateJWT, UserFilterController.GetUser); // Get single user
routes.post("/blockuser", AuthenticateJWT, UserFilterController.BlockUser);

export default routes;