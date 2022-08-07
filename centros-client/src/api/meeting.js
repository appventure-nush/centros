import {getMysqlFormattedDate} from "@/data/formatter";
import {meetingStatusToColor} from "@/data/globals";

export async function getPublicMeetings() {
    let events = []
    try {
        const req = await fetch("/api/meeting/public")
        if (req.status === 200) {
            for (const m of await req.json()) {
                const event = {}
                event.name = m.name
                event.email = m.email
                event.meeting_status = m.meeting_status
                event.venue = m.venue
                let date = new Date(m.date)
                event.date = getMysqlFormattedDate(date)
                event.start = getMysqlFormattedDate(date) + " " + m.start_time
                event.end = getMysqlFormattedDate(date) + " " + m.end_time
                event.color = meetingStatusToColor[event.meeting_status]
                event.meeting_id = m.meeting_id
                events.push(event)
            }
            return events;
        } else return null
    } catch (e) {
        console.log(e)
        return null
    }
}
export async function postAcceptMeeting(counsellor_id, meeting_id, venue) {
    let data = {
        counsellor_id: counsellor_id,
        meeting_id: meeting_id,
        venue: venue
    }
    const res = await (await fetch("/api/meeting/accept", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
    if (!res.success) {
        throw new Error(res.message);
    }
    return res;
}

export async function postCompleteMeeting(meeting_id) {
    const res = await (await fetch("/api/meeting/complete", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({meeting_id})
    })).json()
    if (!res.success) {
        throw new Error(res.message);
    }
    return res;
}

export async function postDeclineMeeting(meeting_id, reason) {
    let data = {
        meeting_id: meeting_id,
        reason: reason
    }
    const res = await (await fetch("/api/meeting/decline", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()

    if (!res.success) {
        throw new Error(res.message);
    }
    return res;
}

export async function getUserScheduledMeetings() {
    let meetings = []
    try {
        const req = await fetch("/api/meeting/user")
        if (req.status === 200) {
            for (const m of await req.json()) {
                m.date = new Date(m.date)
                m.start_time = new Date(getMysqlFormattedDate(m.date) + " " + m.start_time)
                m.end_time = new Date(getMysqlFormattedDate(m.date) + " " + m.end_time)
                meetings.push(m)
            }
            return meetings;
        } else return []
    } catch (e) {
        console.log(e)
        return []
    }
}

export async function scheduleMeeting(student_id, description, date, startTime, endTime) {
    // following exact naming from DDL
    let data = {
        student_id: student_id,
        description: description,
        date: date,
        start_time: startTime,
        end_time: endTime
    }
    // console.log(data)
    const res = await (await fetch("/api/meeting/schedule", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(data)
    })).json()
    if (!res.success) {
        throw new Error(res.message);
    }
    return res;
}

