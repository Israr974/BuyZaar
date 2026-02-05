export const validateUrlConverter=(name)=>{
    const url=name.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-")
    return url
}