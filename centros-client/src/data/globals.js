module.exports.subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computing Studies',
    'History', 'Geography', 'Music', 'Art', 'English Literature', 'Economics']
module.exports.houses = ['Faraday', 'Fibonacci', 'Fleming', 'Nobel']
module.exports.mentorGroups = Array.from(Array(7).keys()).map(x => x + 1).map(x => '0' + x)
module.exports.maxContiguousMeetingInterval = 3
module.exports.meetingStatusToColor = {
    PENDING: 'warning',
    SCHEDULED: 'success',
    CANCELLED: 'dark grey',
    COMPLETED: 'primary'
}
