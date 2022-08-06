const fetchManager = require("./utils/fetchManager");
const {
    addCourse,
    hasUserEntry,
    addUniversity,
    getUniversity,
    registerStudent,
    getAllScheduledMeetings,
    getUserMetadata,
    addMajor,
    addHonour,
    getAllMeetingsForStudent,
    declineMeeting,
    acceptMeeting,
    checkIfAdmin,
    getCategories,
    addCategory,
    addDocument,
    getUserDocument,
    addGuide,
    getGuides,
    getCourses,
    submitReviewRequest,
    editMentorGroup, completeMeeting, getUserSharedDocument, completeReview, getStudentReview, getCounsellorReview,
    isCounsellor, getAllMeetingsForCounsellor,
} = require("./db/database")
const mime = require('mime-types')
const {ErrorMessages} = require("./msal/errors");
const {scheduleMeeting} = require("./db/database")
const assert = require("assert");
const getRoutes = (mainController, authProvider, router) => {
    const adminPreCheck = async (req, res, next) => {
        // if (!req.session.isAdmin) {
        //     return res.status(401).send(ErrorMessages.NOT_PERMITTED);
        // } else {
            next()
        // }
    }
    const preChecks = [authProvider.isAuthenticated, authProvider.getToken, async (req, res, next) => {
        if (!!req.session && !!req.session.isAuthenticated) {
            if (!req.session.name || !req.session.email || !req.session.user_id) {
                // user data not stored, retrieving from microsoft
                console.log("retrieve from microsoft")
                let profile;
                try {
                    profile = await fetchManager.callAPI(req.app.locals.appSettings.resources.graphAPI.endpoint,
                        req.session["graphAPI"].accessToken);
                } catch (error) {
                    console.log(error)
                }
                req.session.name = profile.displayName
                req.session.email = profile.mail
                req.session.user_id = profile.mail.split('@')[0]
                req.session.hasRegistered = await hasUserEntry(req.session.user_id)
                req.session.isAdmin = await checkIfAdmin(req.session.user_id)
            }
        }
        req.session.save(function (err) {
            next()
        })
    }]

    // authentication routes
    router.get('/signin', authProvider.signIn);
    router.get('/signout', authProvider.signOut);
    router.get('/redirect', authProvider.handleRedirect);

    // main app route

    // load user info
    router.get('/', async (req, res, next) => {
        if (!!req.session && !!req.session.isAuthenticated) {
            if (!req.session.hasRegistered) {
                res.status(200).redirect('/register')
            } else {
                res.status(200).redirect('/calendar')
            }
        } else {
            next()
        }
    });

    // register middleware
    router.get('/register', preChecks, async (req, res, next) => {
        if (req.session && req.session.hasRegistered) {
            return res.status(200).redirect('/calendar')
        }

        let hasRegistered = await hasUserEntry(req.session.user_id)
        if (hasRegistered) {
            req.session.hasRegistered = true
            return res.status(200).redirect('/calendar')
        } else {
            next()
        }
    });

    //api route
    router.get('/api/me', preChecks, async (req, res) => {
        if (!!req.session.name && !!req.session.email && !!req.session.user_id && !!req.session.hasRegistered && req.session.hasOwnProperty('isAdmin')) {
            // we already have user data in session storage
            res.json({
                name: req.session.name,
                email: req.session.email,
                user_id: req.session.user_id,
                hasRegistered: req.session.hasRegistered,
                isAdmin: req.session.isAdmin
            })
        } else {
            res.status(500).send('user info not found in session')
        }
    })

    router.post('/api/submit', preChecks, async (req, res) => {
        let data = req.body
        if (!data.house || !data.majors || !data.honours || !data.mentorClass || !data.year) {
            res.json({success: false});
            return;
        }

        let profile;
        try {
            profile = await fetchManager.callAPI(req.app.locals.appSettings.resources.graphAPI.endpoint, req.session["graphAPI"].accessToken);
        } catch (error) {
            console.log(error)
            res.json({success: false});
            return;
        }

        let currYear = new Date().getFullYear()
        let gradYear = currYear + (6 - data.year)
        let userId = req.session.user_id
        let mentorClassFormatted = 'M' + (currYear % 100) + data.year + data.mentorClass
        let success = await registerStudent(userId, profile.displayName, profile.mail, gradYear, data.house, mentorClassFormatted)

        for (const major of data.majors) {
            success = success && await addMajor(req.session.user_id, major)
        }

        for (const honour of data.honours) {
            success = success && await addHonour(req.session.user_id, honour)
        }

        if (success) {
            req.session.hasRegistered = true
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/category', preChecks, async (req, res) => {
        res.json(await getCategories());
    });

    router.post('/api/category/create', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await addCategory(data.name)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/document/user', preChecks, async (req, res) => {
        let documents = await getUserDocument(req.session.user_id)
        for (let d of documents) {
            if (mime.lookup(d.file_type).split('/')[0] === 'image') {
                d.file_type = 'image'
            }
        }
        res.json(documents);
    });

    router.get('/api/document/shared', preChecks, adminPreCheck, async (req, res) => {
        let documents = await getUserSharedDocument(req.session.user_id)
        for (let d of documents) {
            if (mime.lookup(d.file_type).split('/')[0] === 'image') {
                d.file_type = 'image'
            }
        }
        res.json(documents);
    });

    router.post('/api/document/create', preChecks, async (req, res) => {
        let data = req.body
        let file_type = mime.extension(data.mime_type)
        let success = await addDocument(req.session.user_id, data.file_name, file_type, data.link,
            data.access_time, data.access_date, data.document_type)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/guide', preChecks, async (req, res) => {
        res.json(await getGuides());
    });

    router.post('/api/guide/create', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await addGuide(req.session.user_id,
            data.document_id, data.category, data.title, data.description, data.image_link)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/uni', preChecks, async (req, res) => {
        res.json(await getUniversity());
    });

    router.post('/api/uni/create', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await addUniversity(data.name, data.country, data.state, data.enrollment, data.website,
            data.imageLink, data.startDate, data.endDate)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/review', preChecks, async (req, res) => {
        if (req.session.isAdmin) {
            res.json(await getCounsellorReview())
        } else {
            res.json(await getStudentReview(req.session.user_id));
        }
    });

    router.post('/api/review/complete', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await completeReview(req.session.user_id, data.review_id)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.post('/api/review/create', preChecks, async (req, res) => {
        let data = req.body
        let success = await submitReviewRequest(req.session.user_id, data.document_id, data.request_date, data.request_time)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/course', preChecks, async (req, res) => {
        res.json(await getCourses());
    });

    router.post('/api/course/create', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await addCourse(data.uni_name, data.title, data.faculty, data.description, data.tuition_fee, data.duration, data.image_link)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/meeting/public', preChecks, async (req, res) => {
        res.json(await getAllScheduledMeetings());
    });

    router.get('/api/meeting/user', preChecks, async (req, res) => {
        let counsellor = await isCounsellor(req.session.user_id)
        if (counsellor) {
            res.json(await getAllMeetingsForCounsellor(req.session.user_id))
        } else {
            res.json(await getAllMeetingsForStudent(req.session.user_id))
        }
    });

    router.post('/api/meeting/complete', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await completeMeeting(data.meeting_id)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.post('/api/meeting/accept', preChecks, adminPreCheck, async (req, res) => {
        let data = req.body
        let success = await acceptMeeting(data.meeting_id, data.counsellor_id, data.venue)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.post('/api/meeting/decline', preChecks, async (req, res) => {
        let data = req.body
        let success = await declineMeeting(data.meeting_id, data.reason)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.post('/api/meeting/schedule', preChecks, async (req, res) => {
        let data = req.body
        let success = await scheduleMeeting(data.student_id, data.description, data.date, data.start_time, data.end_time)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    router.get('/api/meta', preChecks, async (req, res) => {
        res.json(await getUserMetadata(req.session.user_id));
    });

    router.post('/api/meta/editmg', preChecks, async (req, res) => {
        let data = req.body
        let success = await editMentorGroup(data.mentor_group, req.session.user_id)
        if (success) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });

    return router;
}

module.exports = getRoutes;