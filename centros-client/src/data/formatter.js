import dateFormat from "dateformat";

export function getFormattedDate(date, year = false, short = false) {
    if (!date) return null
    if (year) {
        if (short) return dateFormat(date, "dd mmm yyyy")
        return dateFormat(date, "dddd, mmmm dS yyyy")
    } else {
        if (short) return dateFormat(date, "dd mmm")
        return dateFormat(date, "dddd, mmmm dS")
    }
}

export function getFormattedTime(date) {
    return dateFormat(date, "h:MM TT")
}

export function getMysqlFormattedDate(date) {
    return dateFormat(date, "yyyy-mm-dd")
}

export function getMysqlFormattedTime(date) {
    return dateFormat(date, 'HH:MM:ss')
}