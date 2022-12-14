
import {con} from "../../config/conMySQL.js"

const saveImageData =  () => {
    const  variable = [1];
    let spl = `
        INSERT INTO image_area(is_image_area)
        VALUES(?)`;
    return con.execute(spl,variable);
}

const getNumOfImageArea = async()=>{
    const sql = `SELECT COUNT(id) FROM image_area WHERE is_image_area = 1;`
    const [[ { 'COUNT(id)': count } ],_] = await con.execute(sql);
    return count;
}
const getMaxImageArea = async()=>{
    const sql = `SELECT MAX(id) FROM image_area`
    const [[ { 'MAX(id)': max } ],_] = await con.execute(sql);
    return max;
}

const changeStateOfIsImageArea = (isImageArea,id)=>{
    const  variable = [isImageArea,id];
    const sql = `UPDATE image_area SET is_image_area = ? WHERE id = ?; `
    return con.execute(sql,variable);
}

const getImageAreaId = async(init,num)=>{
    const  variable = [init,num].map(el => el.toString());//數字轉換為字串
    let sql = `SELECT id FROM image_area WHERE is_image_area = 1 ORDER BY id DESC LIMIT ?,?;` 
    const [idArray] = await con.execute(sql,variable);
    return idArray;
    
}

export default{
    saveImageData,
    getNumOfImageArea,
    getMaxImageArea,
    changeStateOfIsImageArea,
    getImageAreaId
}



