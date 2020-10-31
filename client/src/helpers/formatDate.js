export const formatDate = (date) => {
    let d = new Date(date);
    const day = d.getUTCDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    //
    const dateFormat = day + '/' + month + '/' + year;
    return dateFormat;
}

export const formatFullDate = (date) => {
    let d = new Date(date);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const day = d.getUTCDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    //ss:mm:hh dd/mm/yyyy
    const dateFormat = second + ':' + minute + ':' + hour + ' ' + day + '/' + month + '/' + year;
    return dateFormat;
}

export const formatToTimeZoneDate = (stringDate) => {
    let dateArray = stringDate.split("-");
    if (dateArray[0]) {
        var day = dateArray[0];
    }
    if (dateArray[1]) {
        var month = dateArray[1];
    }
    if (dateArray[2]) {
        var year = dateArray[2]
    }
    if (day) {
        return `${year}-${month}-${day}`
    }
    if (!day) {
        return `${year}-${month}`
    }

} 
