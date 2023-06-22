export const notFound = (msg) => {
    msg ='해당 데이터를 찾을수 없습니다.'
    const error = new Error(msg)    
    error.statusCode = 404
    return error;
}
export const unAuthorizedError = (msg) => {
    msg = '해당 데이터에 접근 권한이 없습니다.'
    const error = new Error(msg)    
    error.statusCode = 401
    return error;

}
export const badRequest = (msg,errorData) => {
    msg = '필수 필드를 채워주세요.'
    const error = new Error(msg)    
    error.statusCode = 400;
    error.data = errorData ? errorData:[]
    return error;
}