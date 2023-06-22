export default function errorHandler (err,req,res,next) {
    const statusCode = err.statusCode ? err.statusCode : 500;
    const data = err.data ? err.data : []  
    
    res.status(statusCode)
        .json({
            message:err.message,
            errors:data,
            isError: true
        })
}