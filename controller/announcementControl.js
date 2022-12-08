import announcement from "../model/MySQL/announcement.js";
import { htmlGetImgReplace } from "../lib/regularExpression.js";

const addArticle = async(req,res)=>{
    try {

        const {title,content} = req.body;
        if(title === undefined || content === undefined ) return res.status(200).json({"message":"cannot be blank"});
        await announcement.saveAnnouncement(title,content);
        return res.status(201).json({"message":"OK"});

    } catch (error) {

        console.log(error);
        return res.status(406).json({"message":"err"});
        
    }
}

const editArticle = async(req,res)=>{
    try {
        const {	id,title,content } = req.body;
        await announcement.updateAnnouncementById(title,content,id);
        return res.status(200).json({"message":"修改成功"});
    } catch (error) {

        console.log(error);
        return res.status(406).json({"message":"err"});
        
    }
}
const getAnnouncement = async(req,res) =>{
    try {

        const init = req.body.num;
        const count = await announcement.getNumOfAnnouncement();
        const dif = count-init

        if(dif>=5){
            const announcementArray = await announcement.getAnnouncementByLimit(init,5);
            for(let item of announcementArray){
                const str = Buffer.from(item.content).toString('utf-8');//將資料庫中二進制資料用用(utf-8)解碼
                const result = htmlGetImgReplace(str);//取得圖片及文字區塊
                item.content = str
                item.preview = result; //新增預覽物件
            }
            return res.status(200).json({"announcement":announcementArray});
        }
        if(dif<0) return res.status(200).json({"announcement":[]});
        //==0||<5
        const announcementArray = await announcement.getAnnouncementByLimit(init,dif);
        for(let item of announcementArray){
            const str = Buffer.from(item.content).toString('utf-8');
            const result = htmlGetImgReplace(str);
            item.content = str
            item.preview = result; //新增預覽物件
        }
        return res.status(200).json({"announcement":announcementArray})
        
    } catch (error) {

        console.log(error);
        return res.status(406).json({"message":"err"});
        
    }
}

const delAnnouncement = async(req,res)=>{
    try {

        const {id} = req.body;
        await announcement.changeAnnouncementStatusById(0,id);
        return res.status(200).json({"message":"刪除成功"})
        
    } catch (error) {

        console.log(error);
        return res.status(406).json({"message":"err"});
        
    }
   


}


export default{
    addArticle,
    editArticle,
    getAnnouncement,
    delAnnouncement
}