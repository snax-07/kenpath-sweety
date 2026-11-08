import { Router } from "express";
import { loginController, logoutController, meController, registerController } from "../controllers/index.js";

const route = Router();

route.post("/auth/signup", registerController);
route.post("/auth/login", loginController);
route.post("/auth/logout", logoutController);
route.get("/auth/me", meController);

export default route;