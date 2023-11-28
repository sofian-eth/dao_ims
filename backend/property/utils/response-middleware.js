
const Response=(req,res,next)=>{
    res.Success = (data={},message='',errorCode) => {
        res.status(200).send({success:true,message,errorCode,data})
    }
    res.Error = (message='',errorCode='',data={}) => {
        res.status(200).send({success:false,message,errorCode,data})
    }
    res.Ok=(data=null,message="Success")=>{
        res.status(200).json({status:200,message,data});
    },
    res.BadRequest=(data=null,message="Bad request")=>{
        res.status(200).send({status:400,message,data});
    },
    res.UnAuthorized=(data=null,message="Unauthorized")=>{
        res.status(200).send({status:401,message,sata:data});
    }
    res.Forbidden=(data=null,message="Forbidden")=>{
        res.status(200).send({status:403,message,data});
    }
    res.NotFound=(data=null,message="Not found")=>{
        res.status(200).send({status:404,message,data});
    }
    res.NotAllowed=(data=null,message="Not allowed")=>{
        res.status(200).send({status:405,message,data});
    }
    res.NotAcceptable=(data=null,message="Not acceptable")=>{
        res.status(200).send({status:406,message,data});
    }
    res.InternalServerError=(data=null,message="Internal server error")=>{
        console.log({message,data});
        res.status(200).send({status:500,message,error:data});
    }
    res.Response=(data=null,message=null,code=null,error=null)=>{
        console.log({status:code,message,data});
        res.status(200).send({status:code,message,data,error});
    }
    next();
}
module.exports=Response;
