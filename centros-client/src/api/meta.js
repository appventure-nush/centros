export async function getUserMetadata() {
    try {
        const req = await fetch("/api/meta")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function postEditMentorGroup(mentor_group) {
    return await (await fetch("/api/meta/editmg", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({mentor_group})
    })).json()
}