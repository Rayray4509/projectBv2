import {Router} from "express";
import imageController from "../controller/imageControl.js";
import announcementController from "../controller/announcementControl.js";
import managerOptions from "../controller/manager.js";



const router = Router();

//Admin
router.post("/writeManagerInfo", managerOptions.register);

//Image
router.post("/uploadImage",imageController.getImageId,imageController.uploadImg);
router.post("/removeImage",imageController.removeImage);
router.post("/renderImageArea",imageController.renderImageArea);

//Article
router.post("/addArticle",announcementController.addArticle);
router.post("/editArticle",announcementController.editArticle);








export default{router}