import { Router } from "express";
import managerOptions from "../controller/manager.js";
import announcementController from "../controller/announcementControl.js";
import register from "../controller/memberController.js"
import passwordRevise from "../controller/passwordRevise.js";


const router = Router();

//Member
router.post("/login", managerOptions.login);
router.post("/addaccount",register.register);
router.post("/sendEmail",register.sendEmail);
router.post("/forgotPassword",passwordRevise.passwordForgot);


//Article
router.post("/getAnnouncement",announcementController.getAnnouncement);








export default { router }