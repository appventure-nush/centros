export async function postCreateGuide(document_id, category, title, description, image_link) {
    let data = {
        document_id, category, title, description, image_link
    }
    console.log(data)
    return await (await fetch("/api/guide/create", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
}

export async function getGuides() {
    try {
        const req = await fetch("/api/guide")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}