export const formatFunction = {
    formatDate,
    formatDateTime,
}

function formatDate(date, monthYear = false) {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    } else {
        return date
    }
}

function formatDateTime(date) {
        const d = new Date(date);
        const localeTime = d.toLocaleTimeString();

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${localeTime} ${day}-${month}-${year}`;
    }