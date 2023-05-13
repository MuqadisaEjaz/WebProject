import jwt from "jsonwebtoken";
import Teacher from '../Models/Teacher.js'

 const authMiddleware = (role) => async(req,res,next)=>{

    const token=req.headers.authorization.split(' ')[1];
    //console.log(token)
    if(token==null){
      res.send("Token not provided")
      return
    }
    try{
        const decodedToken= jwt.verify(token,"Secret")
          console.log(decodedToken)
          const user = await Teacher.findOne({ _id: decodedToken._id });
          if (user.length === 0) {
            return res.send('Error: User not found');
          } else {

            req.token = token;
            req.user = user;
            req.TeacherId = user.TeacherId;
            console.log(req.TeacherId);
            console.log(user.name)
            const firstLetter = user.TeacherId.charAt(0);
            if (!role.includes(firstLetter)) {
              return res.status(403).json({ message: "Authorization Failed" });
            }
            // req.token = token;
            //  req.user = user;
            //  res.json({
            //   success:true,
            //   data:{
            //     user:user.name,
            //     email:user.email,
            //     token:token
            //   }
            //  })
          }
     }catch{
           return res.send("Invalid token")
          }
             next()
        
    }


    export default authMiddleware