export async function getUniversityData() {
    try {
        const req = await fetch("/api/uni")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function postCreateUni(name, country, state, enrollment, website, imageLink, startDate, endDate) {
    let data = {
        name, country, state, enrollment, website, imageLink, startDate, endDate
    }
    return await (await fetch("/api/uni/create", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
}