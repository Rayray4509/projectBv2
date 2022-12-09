import {con} from "../../config/conMySQL.js"

const saveAnnouncement =  (title,content) => {
   
    const  variable = [title,content];
    let spl = `
    INSERT INTO announcement(title,content,status)VALUES(?,?,1)`;
    return con.execute(spl,variable);
}

const getNumOfAnnouncement = async()=>{  
    const sql = `SELECT COUNT(id) FROM announcement  WHERE status = 1;`
    const [[ { 'COUNT(id)': count } ],_] = await con.execute(sql);
    return count;
}

const getAnnouncementByLimit = async(init,num)=>{
    let sql = `SELECT * FROM announcement WHERE status = 1 ORDER BY id DESC LIMIT ${init},${num};`
    const [AnnouncementArray] = await con.execute(sql);
    return AnnouncementArray;
}

const getAnnouncementById = async(id)=>{ //預留透過ID取得內容
    const  variable = [id];
    let sql = `SELECT id FROM announcement WHERE id = ? AND status = 1`
    const [announcement] = await con.execute(sql,variable);
    return announcement;
}
const updateAnnouncementById = (title,content,id)=>{ //填入不是asyncFunc
    const  variable = [title,content,id];
    const sql = `UPDATE announcement SET title = ? ,content = ? WHERE id = ?; `
    return con.execute(sql,variable);
}
const changeAnnouncementStatusById = (status,id)=>{ 
    const  variable = [status,id];
    const sql = `UPDATE announcement SET status = ? WHERE id = ?; `
    return con.execute(sql,variable);
}

export default{
    saveAnnouncement,
    getAnnouncementById,
    getAnnouncementByLimit,
    getNumOfAnnouncement,
    updateAnnouncementById,
    changeAnnouncementStatusById

}



