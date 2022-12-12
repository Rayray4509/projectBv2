const adminAuth = (req,res,next)=>{
   
    if(req.isAuthenticated() && req.user.permission == 2) return next();
    return res.status(405).json({"message":"youCantDoThat"})
}

const memberAuth = (req,res,next)=>{

    if(req.isAuthenticated()) return next();
    return res.status(405).json({"message":"youCantDoThat"})
}


export default{
    adminAuth,
    memberAuth
}