import fs from "fs/promises"
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exists = async filePath => await fs.access(filePath).then(() => true).catch(() => false);//檢查檔案是否存在
 
const fileToBase64 = async (id) =>{
    
    const url = path.join(__dirname,`../image/${id}.png`)
    const isExists = await exists(url)
   
    if (isExists) {
        const base64 = await fs.readFile(url, {encoding: 'base64'});
        return base64;
    }
 
}

export{fileToBase64}

