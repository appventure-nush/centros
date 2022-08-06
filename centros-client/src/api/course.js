export async function getCourses() {
    try {
        const req = await fetch("/api/course")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function postCreateCourse(uni_name, title, faculty, description, tuition_fee, duration, image_link) {
    let data = {
        uni_name, title, faculty, description, tuition_fee, duration, image_link
    }
    return await (await fetch("/api/course/create", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
}