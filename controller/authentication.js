const adminAurth = (req,res,next)=>{
   
    if(req.isAuthenticated() && req.user.permission == 1) return next();
    return res.status(405).json({"message":"youCantDoThat"})
}

const memberAurth = (req,res,next)=>{

    if(req.isAuthenticated()) return next();
    return res.status(405).json({"message":"youCantDoThat"})
}


export default{
    adminAurth,
    memberAurth
}