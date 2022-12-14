import { MulterError } from "multer";
import { upload } from "../config/multer.js";
import image from "../model/MySQL/image.js";
import { fileToBase64 } from "../lib/fileToBase64.js";


const uploadImg = (req, res) => {

  upload(req, res, async (err) => {

    try {

      if (req.fileSizeError) {
        return res.status(406).json({ "message": req.fileSizeError });
      }
      if (req.fileTypeError) {
        return res.status(406).json({ "message": req.fileTypeError });
      }
      if (err instanceof MulterError) {
        return res.status(406).json({ "message": err.message });
        // A Multer error occurred when uploading.
      }
      if (err) {
        return res.status(406).json({ "message": err.message });
        // An unknown error occurred when uploading.
      }

      // Everything went fine. 
      await image.saveImageData();
      return res.status(201).json({ "message": "上傳成功" });

    } catch (error) {
      console.log(error);
      return res.status(406).json({ "message": "err" });

    }
  }
  )
}

const getImageId = async (req, res, next) => {  //取得最大ID用於命名照片
  try {
    let maxImageID = await image.getMaxImageArea();
    if (maxImageID === null) {
      maxImageID = 1;
      req.maxImageID = maxImageID;
      return next();
    }
    req.maxImageID = maxImageID + 1;
    next();

  } catch (error) {
    console.log(error);
    return res.status(406).json({ "message": "err" });

  }

}
const removeImage = async (req, res) => {
  try {
    const { id } = req.body;
    await image.changeStateOfIsImageArea(0, id);
    res.status(200).json({ "message": "刪除成功" });

  } catch (error) {
    console.log(error);
    return res.status(406).json({ "message": "err" });

  }


}
const renderImageArea = async (req, res) => {

  try {

    const init = req.body.num;
    const count = await image.getNumOfImageArea();
    const dif = count - init;//計算圖片剩餘量
    //下列為三種判斷分別為資料量大於等於12小於12大於0與小於0所應對方式
    if (dif >= 12) {
      const imageArray = [];
      const idArray = await image.getImageAreaId(init, 12);
      for (const id of idArray) {
        const base64 = await fileToBase64(id.id);
        imageArray.push({ "id": id.id, "base64": base64 });
      }

      return res.status(200).json({ "image": imageArray });
    };

    if (dif < 0) return res.status(200).json({ "image": [] });

    //dif==0||<12
    const imageArray = [];
    const idArray = await image.getImageAreaId(init, dif);
    for (const id of idArray) {
      const base64 = await fileToBase64(id.id);
      imageArray.push({ "id": id.id, "base64": base64 });
    }
    return res.status(200).json({ "image": imageArray });


  } catch (err) {
    console.log(err);
    return res.status(406).json({ "message": "err" })

  }


}




export default {
  uploadImg,
  getImageId,
  removeImage,
  renderImageArea
}


