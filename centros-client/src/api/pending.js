async function getAllPendingMeetings() {
    try {
        const req = await fetch("/api/pending")
        if (req.status === 200) return req.json()
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}

module.exports = {getAllPendingMeetings}