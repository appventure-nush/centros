const mysql = require('mysql2/promise')
const config = require('./config')
const {user} = require("./config");

async function addMajor(user_id, subject_name) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`call addMajor(?, ?)`, [user_id, subject_name]);
    await conn.end();
    return !handleError(rows);
}

async function addHonour(user_id, subject_name) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`call addHonour(?, ?)`, [user_id, subject_name]);
    await conn.end();
    return !handleError(rows);
}

async function getUserMetadata(user_id) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`select user_type, graduation_year, house, mentor_group from user where user_id = ?`,
        [user_id]);
    handleError(rows)
    let metadata = rows[0]
    const [rows2, field2] = await conn.execute(`select subject.name from honour, subject where user_id = ? and subject.code = honour.code`,
        [user_id]);

    // looks something like [ { name: 'Biology' }, { name: 'Computing Studies' } ]
    metadata.honours = []
    for (const entry of rows2) {
        metadata.honours.push(entry['name'])
    }
    const [rows3, field3] = await conn.execute(`select subject.name from major, subject where user_id = ? and subject.code = major.code`,
        [user_id]);
    handleError(rows3)
    metadata.majors = []
    for (const entry of rows3) {
        metadata.majors.push(entry['name'])
    }
    await conn.end();
    return metadata
}

async function getAllMeetingsForStudent(student_id) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`select * from meeting_user_view where student_id = ?`, [student_id]);
    await conn.end();
    handleError(rows)
    return rows;
}

async function getAllMeetingsForCounsellor(counsellor_id) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`select * from meeting_user_view where counsellor_id = ?`, [counsellor_id]);
    await conn.end();
    handleError(rows)
    return rows;
}

async function getAllScheduledMeetings() {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`select * from meeting_public_view`);
    await conn.end();
    handleError(rows)
    return rows;
}

async function completeMeeting(meeting_id) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`call completeMeeting(?)`, [meeting_id]);
    await conn.end()
    return !handleError(rows)
}

async function getUniversity() {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute('select * from university');
    await conn.end();
    return rows
}

async function addUniversity(name, country, state, enrollment, website, imageLink, startDate, endDate) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`insert into university values (?,?,?,?,?,?,?,?)`,
        [name, enrollment, country, state, website, imageLink, startDate, endDate]);
    await conn.end();
    return !handleError(rows)
}

async function addCourse(uni_name, title, faculty, description, tuition_fee, duration, image_link) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`insert into course value (?,?,?,?,?,?,?)`,
        [uni_name, title, faculty, description, tuition_fee, duration, image_link]);
    await conn.end();
    return !handleError(rows)
}

async function getCourses() {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select * from course`)
    await conn.end();
    handleError(rows)
    return rows
}


async function hasUserEntry(user_id) {
    const conn = await mysql.createConnection(config);
    await conn.execute('call hasUserEntry(?, @res)', [user_id]);
    const [rows, fields] = await conn.execute('select @res');
    await conn.end();
    handleError(rows)
    // output looks like: [ { '@res': 1 } ]
    return rows[0]['@res'] === 1;
}


async function isCounsellor(user_id) {
    const conn = await mysql.createConnection(config);
    await conn.execute('call isCounsellor(?, @res)', [user_id]);
    const [rows, fields] = await conn.execute('select @res');
    await conn.end();
    handleError(rows)
    // output looks like: [ { '@res': 1 } ]
    return rows[0]['@res'] === 1;
}


async function checkIfAdmin(user_id) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select * from user where user_id = ? and user_type <> 'STUDENT'`, [user_id]);
    await conn.end();
    handleError(rows)
    return rows.length > 0
}

async function registerStudent(user_id, name, email, gradYear, house, mentorClass) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`insert into user values (?,'STUDENT',?,?,?,?,?)`,
        [user_id, name, email, gradYear, house, mentorClass]);
    await conn.end();
    return !handleError(rows);
}

async function acceptMeeting(meeting_id, counsellor_id, venue) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`call acceptMeeting(?,?,?)`, [meeting_id, counsellor_id, venue]);
    await conn.end();
    return !handleError(rows);
}

async function declineMeeting(meeting_id, reason) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`call cancelMeeting(?,?)`, [meeting_id, reason]);
    await conn.end();
    return !handleError(rows);
}

async function scheduleMeeting(student_id, desc, date, startTime, endTime) {
    const conn = await mysql.createConnection(config);
    const [rows, field] = await conn.execute(`call requestMeeting(?,?,?,?,?)`, [student_id, desc, date, startTime, endTime]);
    await conn.end();
    return !handleError(rows);
}

async function getCategories() {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select name from category`);
    await conn.end();
    handleError(rows)
    return rows
}

async function addCategory(category) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`insert into category value (?)`, [category]);
    await conn.end();
    return !handleError(rows)
}

async function completeReview(counsellor_id, review_id) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`call completeReview(?,?)`, [counsellor_id, review_id]);
    await conn.end();
    return !handleError(rows)
}

async function getStudentReview(user_id) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select * from student_review_view where owner_id = ?`, [user_id]);
    await conn.end();
    handleError(rows)
    return rows
}

async function getCounsellorReview() {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select * from counsellor_review_view`);
    await conn.end();
    handleError(rows)
    return rows
}

async function submitReviewRequest(owner_id, document_id, request_date, request_time) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`insert into review value (UUID(), ?, ?, ?, ?, ?, ?)`,
        ['PENDING', request_date, request_time, document_id, owner_id, null]);
    await conn.end();
    return !handleError(rows)
}

async function addDocument(owner_id, file_name, file_type, link, access_time, access_date, document_type) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(
        `insert into document value (?, UUID(), ?, ?, ?, ?, ?, ?)`,
        [owner_id, file_name, file_type, link, access_time, access_date, document_type]);
    await conn.end();
    return !handleError(rows)
}

async function getUserDocument(user_id) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select document_id, file_name, file_type, link, last_access_time, last_access_date from document where owner_id = ?`, [user_id]);
    await conn.end();
    handleError(rows)
    return rows
}

const shareQuery = `
select document_id, file_name, file_type, link, last_access_time, last_access_date
from document
where document_id in (
    select minutes_id
    from meeting
    where counsellor_id = ?
    union
    select document_id
    from review
    where counsellor_id = ?
)
`

async function getUserSharedDocument(user_id) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] =
        await conn.execute(shareQuery, [user_id, user_id]);
    await conn.end();
    handleError(rows)
    return rows
}


async function getGuides() {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`select * from guides_view`);
    await conn.end();
    return rows
}

async function addGuide(owner_id, document_id, category, title, description, image_link) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`insert into guide value (?,?,?,?,?,?)`,
        [owner_id, document_id, category, title, description, image_link]);
    await conn.end();
    return !handleError(rows)
}

async function editMentorGroup(mentor_group, user_id) {
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(`update user set mentor_group = ? where user_id = ?`, [mentor_group, user_id]);
    await conn.end();
    return rows
}


function handleError(rows) {
    if (rows.code) {
        console.log("error while executing mysql statement: ")
        console.log(rows.code)
        console.log(rows.errno)
        console.log(rows.sqlMessage)
        return true
    }
    return false
}


module.exports = {
    isCounsellor,
    hasUserEntry,
    getUniversity,
    registerStudent,
    scheduleMeeting,
    getAllScheduledMeetings,
    getUserMetadata,
    addHonour,
    addMajor,
    getAllMeetingsForStudent,
    getAllMeetingsForCounsellor,
    declineMeeting,
    acceptMeeting,
    checkIfAdmin,
    getCategories,
    addCategory,
    addDocument,
    getUserDocument,
    addGuide,
    getGuides,
    addUniversity,
    addCourse,
    getCourses,
    submitReviewRequest,
    editMentorGroup,
    completeMeeting,
    getUserSharedDocument,
    completeReview,
    getStudentReview,
    getCounsellorReview
}