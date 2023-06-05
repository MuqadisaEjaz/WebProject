import jwt from "jsonwebtoken";
import Teacher from '../Models/Teacher.js'

 const authMiddleware = (role) => async(req,res,next)=>{
  const token =req.header('token')

  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     return res.status(401).json({ error: 'Authorization token not found' });
  //   }

   // const token = authHeader.split(' ')[1];

    if(token==null){
      res.send("Token not provided")
      return
    }
    try{
        const decodedToken= jwt.verify(token,"Secret")
          //console.log(decodedToken)
          const user = await Teacher.findOne({ _id: decodedToken._id });
          if (user.length === 0) {
            return res.send('Error: User not found');
          }else {

          const firstLetter = user.TeacherId.charAt(0);
            if (!role.includes(firstLetter)) {
              return res.status(403).json({ message: "Authorization Failed" });
            }
          req.token = token;
          req.TeacherId = user.TeacherId;
          console.log(req.TeacherId);   
          }

     }catch{
           return res.send("Invalid token")
          }
             next()    
    }


    export default authMiddleware