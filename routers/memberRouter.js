import { Router } from "express";
import managerOptions from "../controller/manager.js";
import passwordRevise from "../controller/passwordRevise.js";


const router = Router();

//Member
router.post("/logout", managerOptions.logout);
router.post("/passwordRevise",passwordRevise.passwordRevise);

export default { router }
//衝突