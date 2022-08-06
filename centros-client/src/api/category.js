export async function getCategories() {
    try {
        const req = await fetch("/api/category")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function createCategory(name) {
    const res = await (await fetch("/api/category/create", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({name: name})
    })).json()
    if (!res.success) {
        throw new Error(res.message);
    }
    return res;
}