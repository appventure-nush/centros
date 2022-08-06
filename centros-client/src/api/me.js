async function getUserData() {
    try {
        const req = await fetch("/api/me")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}


module.exports = {getUserData}