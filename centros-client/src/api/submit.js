async function postRegistrationData(house, year, majors, honours, mentorClass) {
    let data = {
        house: house,
        year: year,
        majors: majors,
        honours: honours,
        mentorClass: mentorClass
    }
    return await (await fetch("/api/submit", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
}

module.exports = {postRegistrationData}