export const notFound = (msg='해당 데이터를 찾을수 없습니다.') => {
    const error = new Error(msg)    
    error.statusCode = 404
    return error;
}
export const unAuthorizedError = (msg = '해당 데이터에 접근 권한이 없습니다.') => {
    const error = new Error(msg)    
    error.statusCode = 401
    return error;

}
export const badRequest = (msg='필수 항목을 모두 채워주세요.',errorData) => {
    const error = new Error(msg)    
    error.statusCode = 400;
    error.data = errorData ? errorData : null
    return error;
}