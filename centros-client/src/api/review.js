import {getFormattedDate} from "@/data/formatter";

export async function postSubmitReview(document_id, request_date, request_time) {
    return await (await fetch("/api/review/create", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
            document_id, request_date, request_time
        })
    })).json()
}

export async function postCompleteReview(review_id) {
    return await (await fetch("/api/review/complete", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
            review_id
        })
    })).json()
}

export async function getUserReviews() {
    try {
        const req = await fetch("/api/review")
        if (req.status === 200) {
            let reviews = await req.json()
            for (let review of reviews) {
                review.request_date = getFormattedDate(review.request_date, true, false)
            }
            return reviews
        }
        else return null
    } catch (e) {
        console.log(e)
        return null
    }
}