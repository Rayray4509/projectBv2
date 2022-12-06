import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = path.join(__dirname,"../image") ;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, url);
    },
    filename: function (req, file, cb) {
       
      cb(null, req.maxImageID+".png" );
    }
  })
const uploadFilter = (req, file, cb)=>{
  console.log("uploadFilter");
  console.log(file);

  const fileSize = parseInt(req.headers["content-length"])

  if (fileSize>1048576) {
    
    req.fileSizeError = "file Size too large";
    return cb(null, false, req.fileSizeError);
  }

  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ) return cb(null, true);

  req.fileTypeError = "only png, jpg, jpeg allow to uploaded";
  return cb(null, false, req.fileTypeError);
}


const upload = multer({
    storage:storage,
    limits: { fileSize: 1048576 },
    fileFilter : uploadFilter
}).single("image");

export {upload}