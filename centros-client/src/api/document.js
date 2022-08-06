import {getFormattedDate} from "@/data/formatter";

const {getMysqlFormattedDate, getMysqlFormattedTime} = require("@/data/formatter");

export async function postCreateDocument(file_name, mime_type, link, document_type) {
    let data = {
        file_name: file_name,
        mime_type: mime_type,
        link: link,
        access_time: getMysqlFormattedTime(new Date()),
        access_date: getMysqlFormattedDate(new Date()),
        document_type: document_type
    }
    return await (await fetch("/api/document/create", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
}

export async function getUserDocument() {
    try {
        const req = await fetch("/api/document/user")
        if (req.status === 200) {
            const files = []
            for (const file of await req.json()) {
                file.last_access_datetime = new Date(getMysqlFormattedDate(file.last_access_date) + " " +
                    file.last_access_time)
                file.last_access_date = getFormattedDate(new Date(file.last_access_date))
                files.push(file)
            }
            return files
        } else return null
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function getUserSharedDocument() {
    try {
        const req = await fetch("/api/document/shared")
        if (req.status === 200) {
            const files = []
            for (const file of await req.json()) {
                file.last_access_datetime = new Date(getMysqlFormattedDate(file.last_access_date) + " " +
                    file.last_access_time)
                file.last_access_date = getFormattedDate(new Date(file.last_access_date))
                files.push(file)
            }
            return files
        } else return null
    } catch (e) {
        console.log(e)
        return null
    }
}