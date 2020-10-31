export const generateCode = (code) => {
    const date = new Date();
    const year = String(date.getFullYear()).slice(-2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const stringCode = code + year + month + day + hour + minute + second;
    return stringCode;
}