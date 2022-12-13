const review_id = location.href.split('?')[1].split('&')[0].split('=')[1]
const place_id = location.href.split('?')[1].split('&')[1].split('=')[1]
const author_id = location.href.split('?')[1].split('&')[2].split('=')[1]

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);

//시간 포맷팅
function time2str(date_now) {
    let today = new Date()
    let before = new Date(date_now)
    let time = (today - before) / 1000 / 60  // 분
    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date_now.getFullYear()}년 ${date_now.getMonth() + 1}월 ${date_now.getDate()}일`
};

window.onload = () => {

    // 엔터로만 덧글 등록
    document.querySelector(".nav-input-wrap input").focus();
    document.querySelector(".nav-input-wrap input").onkeyup = function (e) {
        if (e.keyCode === 13) {
            document.querySelector('#button').click();
        }
    }


    // 후기 신고 모달창 trigger
    const reportModal = document.querySelector('#report-modal')
    document.querySelector('#report-button-text').onclick = function () {
        reportModal.style.display = "block"
    }

    const closeReportModal = document.querySelector('#exit-report')
    closeReportModal.onclick = function () {
        reportModal.style.display = "none"
    }
    getData(review_id, place_id)
}
const modalBox = document.querySelector('#modal-box')
const header = document.querySelector('.header')
const main = document.querySelector('.root')
const nav = document.querySelector('.nav-wrap')



// 전체 코멘트랑 같이 상세 페이지 데이터 불러오기
async function getData(review_id, place_id) {


    const response = await fetch(`http://127.0.0.1:8000/reviews/details/${place_id}/${review_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
        .then(response => response.json())

    const reviewLikeHeart = document.querySelector('.comment-cnt img')
    if (response.review_like.includes(payload_parse.user_id)) {
        reviewLikeHeart.src = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
    }
    else {
        reviewLikeHeart.src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
    }
    reviewLikeHeart.onclick = async function () {
        await fetch(`http://127.0.0.1:8000/reviews/${review_id}/likes/`, {
            headers: {
                'content-type': 'application/json',
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'POST',
        })
        getData(review_id, place_id)
    }



    const content = document.querySelector('.review-detail-box p')
    content.innerText = response.content

    const date = document.querySelector('.review-time p')
    date.innerText = `작성 시간 : ${time2str(response.created_at)}`
    date.style.fontSize = "11px"
    date.style.color = "gray"

    const commentCount = document.querySelector('#comment-count')
    commentCount.innerText = response.review_comments.length

    const likeCount = document.querySelector('#like-count')
    likeCount.innerText = response.review_like.length

    const firstImage = document.querySelector('.slidelist li:nth-child(1) img')
    firstImage.src = "http://127.0.0.1:8000" + response.review_image_one
    const secondImage = document.querySelector('.slidelist li:nth-child(2) img')
    secondImage.src = "http://127.0.0.1:8000" + response.review_image_two
    const thirdImage = document.querySelector('.slidelist li:nth-child(3) img')
    thirdImage.src = "http://127.0.0.1:8000" + response.review_image_three

    const title = document.querySelector('h3')
    title.innerText = response.place_name

    const titleLink = document.querySelector('#title-link')
    titleLink.href = `place_detail.html?id=${place_id}`

    const comments = document.querySelector('.comments')
    comments.innerHTML = ""


    response.review_comments.forEach(cmt => {
        const eachComment = document.createElement("div")
        eachComment.classList.add("each-comment")
        comments.appendChild(eachComment)

        const profileImg = document.createElement('img')
        profileImg.classList.add('comment-user-img')
        profileImg.src = "http://127.0.0.1:8000" + cmt.profile_image
        eachComment.appendChild(profileImg)

        const commentContent = document.createElement("div")
        commentContent.classList.add('comment-content')
        eachComment.appendChild(commentContent)

        const commentHead = document.createElement("div")
        commentHead.classList.add("comment-head")
        commentContent.appendChild(commentHead)

        const nickname = document.createElement('p')
        nickname.classList.add('nickname')
        nickname.innerText = cmt.nickname
        nickname.style.color = "#FDA171"
        commentHead.appendChild(nickname)

        const time = document.createElement('p')
        time.classList.add('time')
        time.innerText = time2str(cmt.created_at)
        time.style.fontSize = "11px"
        time.style.color = "gray"
        commentHead.appendChild(time)

        // cmt 신고 모달창 trigger
        const dots = document.createElement('img')
        dots.src = "/images/icon/dot.svg"
        dots.setAttribute("id", `dot${cmt.id}`)
        dots.style.cursor = "pointer"
        commentHead.appendChild(dots)

        const commentReportModal = document.createElement('div')
        commentReportModal.classList.add(`cmt-report${cmt.id}`)
        document.querySelector('body').appendChild(commentReportModal)
        commentReportModal.style.position = "absolute"
        commentReportModal.style.backgroundColor = "white"
        commentReportModal.style.width = "23vw"
        commentReportModal.style.height = "30vh"
        commentReportModal.style.display = "none"
        commentReportModal.style.borderRadius = "25px"
        commentReportModal.style.boxShadow = "4px 4px 4px rgb(199,199,199)"
        commentReportModal.style.left = "50%"
        commentReportModal.style.marginLeft = "-11.5vw"
        commentReportModal.style.top = "50%"
        commentReportModal.style.marginTop = "-15vh"
        commentReportModal.style.zIndex = "1"

        commentReportModal.innerHTML = `<select style="border-radius:10px;width : 88%;margin:3vh auto;display:block" id="comment-report-category${cmt.id}" >
        <option value="욕설이 들어갔어요.">욕설이 들어갔어요.</option>
        <option value="성적인 발언이 들어갔어요.">성적인 발언이 들어갔어요.</option>
        <option value="정치적 요소가 들어갔어요.">정치적 요소가 들어갔어요.</option>
        <option value="관계 없는 내용이예요.">관계 없는 내용이예요.</option>
        <option value="도배된 내용이예요.">도배된 내용이예요.</option>
        <option value="광고성이 포함된 글이예요.">광고성이 포함된 글이예요.</option>
        <option value="기타">기타</option>
    </select>
    <textarea id="comment-report-content${cmt.id}" placeholder="내용을 입력해주세요."></textarea>
    <div class="report-buttons">
        <button id="exit-comment-report${cmt.id}" class="edit-button">닫기</button>
        <button id="comment-report-btn${cmt.id}" class="edit-button" onclick="post_comment_report(${cmt.id})">신고하기</button>
    </div>`

        document.querySelector(`#dot${cmt.id}`).onclick = function () {
            commentReportModal.style.display = "block"

        }
        const closeReportModal = document.querySelector(`#exit-comment-report${cmt.id}`)
        closeReportModal.onclick = function () {
            commentReportModal.style.display = "none"
        }

        const commentText = document.createElement("p")
        commentText.innerText = cmt.content
        commentText.classList.add(`p${cmt.id}`)
        commentContent.appendChild(commentText)


        const commentUnder = document.createElement("div")
        commentUnder.classList.add("comment-under")
        commentContent.appendChild(commentUnder)

        const commentLike = document.createElement("img")
        commentLike.classList.add('comment-like-img')
        commentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
        // if (cmt.comment_like.includes(payload_parse.user_id)) {
        //     commentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
        // }
        // else {
        //     commentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
        // }
        commentLike.style.cursor = "pointer"
        commentUnder.appendChild(commentLike)

        // 덧글 좋아요 기능
        commentLike.onclick = async function () {
            await fetch(`http://127.0.0.1:8000/reviews/comments/${cmt.id}/likes/`, {
                headers: {
                    'content-type': 'application/json',
                    "authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
            })
            getData(review_id, place_id)
        }



        const commentLikeCount = document.createElement("p")
        commentLikeCount.innerText = cmt.comment_like_count
        commentUnder.appendChild(commentLikeCount)

        const recommentContent = document.createElement("div")
        recommentContent.classList.add("recomment-content")
        commentContent.appendChild(recommentContent)


        // 대댓글 모음
        cmt.comment_recomments.forEach(recmt => {
            const recommentBox = document.createElement("div")
            recommentBox.style.display = "flex"
            recommentBox.style.flexDirection = "column"
            recommentBox.style.width = "100%"
            recommentContent.appendChild(recommentBox)



            const recmtContentBox = document.createElement('div')
            recmtContentBox.style.display = "flex"
            recmtContentBox.style.justifyContent = "space-between"
            recommentBox.appendChild(recmtContentBox)



            const recommentImage = document.createElement('img')
            recommentImage.src = "http://127.0.0.1:8000" + recmt.profile_image
            recommentImage.classList.add("comment-user-img")
            recommentImage.style.margin = "1vh 0"
            recmtContentBox.appendChild(recommentImage)

            const recommentNickname = document.createElement('p')
            recommentNickname.innerText = recmt.nickname
            recommentNickname.style.fontSize = "11px"
            recommentNickname.style.margin = "auto 0.5vw"
            recommentNickname.style.color = "#FDA171"
            recmtContentBox.appendChild(recommentNickname)

            const recommentText = document.createElement("p")
            recommentText.setAttribute("id", `recmt${recmt.id}`)
            recommentText.innerText = recmt.content
            recommentText.style.fontSize = "13px"
            recommentText.style.width = "80%"
            recommentText.style.margin = "auto 0"
            recommentText.style.wordBreak = "break-all"
            recmtContentBox.appendChild(recommentText)


            // 리코멘트 작성 시간
            const recmtTime = document.createElement('span')
            recmtTime.innerText = time2str(cmt.created_at)
            recommentText.appendChild(recmtTime)
            recmtTime.style.fontSize = "11px"
            recmtTime.style.margin = "auto 0 auto 2vw"
            recmtTime.style.color = "gray"

            // 리코멘트 신고 버튼
            const recmtReportBtn = document.createElement('span')
            recmtReportBtn.innerText = "신고"
            recmtReportBtn.style.fontSize = "11px"
            recmtReportBtn.setAttribute("id", `recomment-dots${recmt.id}`)
            recmtReportBtn.style.color = "rgb(237, 155, 83)"
            recmtReportBtn.style.margin = "auto 0 auto 2vw"
            recmtReportBtn.style.cursor = "pointer"
            recommentText.appendChild(recmtReportBtn)

            // 리코멘트 모달
            const recommentReportModal = document.createElement('div')
            recommentReportModal.classList.add(`recmt-report${recmt.id}`)
            document.querySelector('body').appendChild(recommentReportModal)
            recommentReportModal.style.position = "absolute"
            recommentReportModal.style.backgroundColor = "white"
            recommentReportModal.style.width = "23vw"
            recommentReportModal.style.height = "30vh"
            recommentReportModal.style.display = "none"
            recommentReportModal.style.borderRadius = "25px"
            recommentReportModal.style.boxShadow = "4px 4px 4px rgb(199,199,199)"
            recommentReportModal.style.left = "50%"
            recommentReportModal.style.marginLeft = "-11.5vw"
            recommentReportModal.style.top = "50%"
            recommentReportModal.style.marginTop = "-15vh"
            recommentReportModal.style.zIndex = "1"

            recommentReportModal.innerHTML = `<select style="border-radius:10px;width : 88%;margin:3vh auto;display:block" id="recomment-report-category${recmt.id}" >
                <option value="욕설이 들어갔어요.">욕설이 들어갔어요.</option>
                <option value="성적인 발언이 들어갔어요.">성적인 발언이 들어갔어요.</option>
                <option value="정치적 요소가 들어갔어요.">정치적 요소가 들어갔어요.</option>
                <option value="관계 없는 내용이예요.">관계 없는 내용이예요.</option>
                <option value="도배된 내용이예요.">도배된 내용이예요.</option>
                <option value="광고성이 포함된 글이예요.">광고성이 포함된 글이예요.</option>
                <option value="기타">기타</option>
            </select>
            <textarea id="recomment-report-content${recmt.id}" placeholder="내용을 입력해주세요."></textarea>
            <div class="report-buttons">
                <button id="exit-recomment-report${recmt.id}" class="edit-button">닫기</button>
                <button id="recomment-report-btn${recmt.id}" class="edit-button" onclick="post_recomment_report(${cmt.id},${recmt.id})">신고하기</button>
            </div>`

            document.querySelector(`#recomment-dots${recmt.id}`).onclick = function () {
                recommentReportModal.style.display = "block"

            }
            const closeRecommentReportModal = document.querySelector(`#exit-recomment-report${recmt.id}`)
            closeRecommentReportModal.onclick = function () {
                recommentReportModal.style.display = "none"
            }



            // 대댓글 수정 삭제 버튼 박스
            const recommentEditBox = document.createElement('div')
            recommentEditBox.style.display = "flex"
            recommentEditBox.style.justifyContent = "space-between"
            recommentEditBox.style.width = "30%"
            recommentEditBox.style.marginLeft = "1vw"
            recommentBox.appendChild(recommentEditBox)

            const recommentLike = document.createElement('img')
            recommentLike.style.width = "13%"
            recommentLike.style.objectFit = "contain"
            recommentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
            recommentEditBox.appendChild(recommentLike)

            // 대댓글 좋아요
            recommentLike.onclick = async function () {
                await fetch(`http://127.0.0.1:8000/reviews/recomments/${recmt.id}/likes/`, {
                    headers: {
                        'content-type': 'application/json',
                        "authorization": "Bearer " + localStorage.getItem("access")
                    },
                    method: 'POST',
                })
                getData(review_id, place_id)
            }

            const recommentLikeCount = document.createElement('p')
            recommentLikeCount.innerText = recmt.recomment_like.length
            recommentLikeCount.style.fontSize = "11px"
            recommentLikeCount.style.margin = "0"
            recommentEditBox.appendChild(recommentLikeCount)


            if (recmt.user_id == payload_parse.user_id) {

                // 대댓글 수정 버튼 생성
                const editRecomment = document.createElement('button')
                const editRecommentText = document.createTextNode('수정')
                editRecomment.appendChild(editRecommentText)
                editRecomment.style.fontSize = "12px"
                editRecomment.classList.add('cmt-btn')
                editRecomment.setAttribute("id", `reEdit${recmt.id}`)
                editRecomment.style.marginRight = "0"
                recommentEditBox.appendChild(editRecomment)


                // 대댓글 수정 인풋 생성
                const editRecommentContent = document.querySelector(`#recmt${recmt.id}`)
                const editRecommentInput = document.createElement('input')
                editRecommentInput.setAttribute("id", `edit-input${cmt.id}`)
                editRecommentInput.style.width = "80%"
                editRecommentContent.parentNode.insertBefore(editRecommentInput, editRecommentContent)
                editRecommentInput.value = editRecommentContent.innerText

                editRecommentInput.style.borderLeftWidth = "0"
                editRecommentInput.style.borderRightWidth = "0"
                editRecommentInput.style.borderTopWidth = "0"
                editRecommentInput.style.borderBottomWidth = "0.2vh"
                editRecommentInput.style.outline = "0"
                editRecommentInput.style.margin = "1vh 1vw"
                editRecommentInput.style.width = "80%"
                editRecommentInput.style.display = "none"

                editRecomment.onclick = function () {
                    editRecommentContent.classList.toggle('recomment-content')
                    editRecommentInput.style.display = "block"

                    const updateButton = document.getElementById(`reEdit${recmt.id}`)
                    updateButton.onclick = async function () {
                        await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${cmt.id}/recomments/${recmt.id}/`, {
                            headers: {
                                'content-type': 'application/json',
                                "authorization": "Bearer " + localStorage.getItem("access")
                            },
                            method: 'PUT',
                            body: JSON.stringify({
                                "content": editRecommentInput.value,
                            })
                        })
                        getData(review_id, place_id)
                    }
                }

                // 대댓글 삭제
                const delRecomment = document.createElement('button')
                const delRecommentText = document.createTextNode('삭제')
                delRecomment.appendChild(delRecommentText)
                delRecomment.classList.add('cmt-btn')
                delRecomment.style.fontSize = "12px"
                delRecomment.style.marginRight = "0"
                recommentEditBox.appendChild(delRecomment)

                delRecomment.onclick = async function () {
                    await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${cmt.id}/recomments/${recmt.id}/`, {
                        headers: {
                            "authorization": "Bearer " + localStorage.getItem("access")
                        },
                        method: 'DELETE',
                    })
                    getData(review_id, place_id)
                }
            }

        })


        const recomment = document.createElement("div")
        recomment.classList.add('recomment')
        recomment.style.justifyContent = "space-between"
        commentContent.appendChild(recomment)

        const recommentInput = document.createElement('input')
        recommentInput.placeholder = "답글 달기"
        recommentInput.classList.add(`input-recomment${cmt.id}`)
        recommentInput.type = "text"
        recomment.appendChild(recommentInput)

        const recommentImg = document.createElement('img')
        recommentImg.style.verticalAlign = "middle"
        recommentInput.parentNode.insertBefore(recommentImg, recommentInput)

        //대댓글 등록
        const recommentButton = document.createElement('button')
        var text = document.createTextNode('등록')
        recommentButton.appendChild(text)
        recommentButton.onclick = async function () {
            const content = document.querySelector(`.input-recomment${cmt.id}`)
            await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${cmt.id}/recomments/`, {
                headers: {
                    'content-type': 'application/json',
                    "authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
                body: JSON.stringify({ // JS object is converted to string.
                    "content": content.value,
                })
            })
            getData(review_id, place_id)
            // insertRecomment.click()
            // recomment.classList.add('show-recomment')
            // recommentContent.classList.add('show-recomment')
        }

        recomment.appendChild(recommentButton)

        // 답글 달기 버튼
        const insertRecomment = document.createElement('button')
        var txt = document.createTextNode('답글 달기')
        insertRecomment.appendChild(txt)
        insertRecomment.classList.add('cmt-btn')
        commentUnder.appendChild(insertRecomment)
        insertRecomment.onclick = async function () {
            recomment.classList.toggle('show-recomment')
            recommentContent.classList.toggle('show-recomment')
            const userResponse = await fetch(`http://127.0.0.1:8000/users/profiles/`, {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("access")
                }
            }
            )
            userResponseJson = await userResponse.json()

            recommentImg.src = "http://127.0.0.1:8000" + userResponseJson.profile_image
            // getData(review_id, place_id)
        }



        // 덧글 수정 버튼
        if (payload_parse.user_id == cmt.user_id) {
            const editComment = document.createElement('button')
            var editText = document.createTextNode('덧글 수정')
            editComment.appendChild(editText)
            editComment.classList.add('cmt-btn')
            commentUnder.appendChild(editComment)

            const editCommentContent = document.querySelector(`.p${cmt.id}`)
            editCommentContent.style.margin = '1vh 0 1.3vh 1vw'

            const editBox = document.createElement('div')
            editBox.style.display = "flex"
            editBox.style.width = "100%"
            editCommentContent.parentNode.insertBefore(editBox, editCommentContent)

            const editInput = document.createElement('input')
            editInput.setAttribute("id", `edit-input${cmt.id}`)
            editInput.style.width = "80%"
            editBox.appendChild(editInput)
            editInput.value = editCommentContent.innerText
            editInput.classList.add('recomment-content')


            editInput.style.borderLeftWidth = "0"
            editInput.style.borderRightWidth = "0"
            editInput.style.borderTopWidth = "0"
            editInput.style.borderBottomWidth = "0.2vh"
            editInput.style.outline = "0"
            editInput.style.margin = "1vh 1vw"

            const editButton = document.createElement('button')
            editButton.classList.add("edit-button")
            var editButtonText = document.createTextNode('수정')
            editButton.appendChild(editButtonText)
            editButton.style.width = "17%"
            editButton.classList.add('recomment-content')
            editBox.appendChild(editButton)
            editButton.onclick = async function () {
                await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${cmt.id}/`, {
                    headers: {
                        'content-type': 'application/json',
                        "authorization": "Bearer " + localStorage.getItem("access")
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        "content": editInput.value,
                    })
                })
                getData(review_id, place_id)
            }


            editComment.onclick = function () {
                editCommentContent.classList.toggle('recomment-content')
                editInput.classList.toggle('recomment-content')
                editButton.classList.toggle('recomment-content')
            }


            // 덧글 삭제 버튼
            const delComment = document.createElement('button')
            var editText = document.createTextNode('덧글 삭제')
            delComment.appendChild(editText)
            delComment.classList.add('cmt-btn')
            commentUnder.appendChild(delComment)
            delComment.onclick = async function () {
                await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${cmt.id}/`, {
                    headers: {
                        "authorization": "Bearer " + localStorage.getItem("access")
                    },
                    method: 'DELETE',
                })
                getData(review_id, place_id)
            }
        }
    });




}


// 코멘트 등록
async function postComment(review_id, content) {
    const response = await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
        body: JSON.stringify({ // JS object is converted to string.
            "content": content,
        })
    })
}


async function writeComment() {
    let content = document.querySelector(".nav-input-wrap input")

    await postComment(review_id, content.value)

    getData(review_id, place_id)
    content.value = null
}



// 알람 
const notificationSocket = new WebSocket(
    'ws://'
    + "127.0.0.1:8000"
    + '/ws/notification/'
    + author_id
    + '/'
);



notificationSocket.onmessage = async function (e) {
    const data = JSON.parse(e.data);
    const alarmBox = document.querySelector('.alarm')
    if (payload_parse.user_id == author_id) {


        const alarmContent = document.createElement('div')
        alarmContent.style.display = "flex"
        alarmContent.style.height = "10vh"
        alarmContent.innerHTML = data.message
        alarmBox.appendChild(alarmContent)
    

    const response = await fetch(`http://127.0.0.1:8000/notification/${payload_parse.user_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())

    const notificationButton = document.createElement('button')
    const notificationButtonText = document.createTextNode('확인')
    notificationButton.appendChild(notificationButtonText)
    notificationButton.onclick = async function () {
        await fetch(`http://127.0.0.1:8000/notification/alarm/${response[0].id}/`, {
            headers: {
                'content-type': 'application/json',
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body: ''
        })
        alarmBox.innerHTML = ""
        getNotification()
    }
    alarmContent.appendChild(notificationButton)
}
};


notificationSocket.onclose = function (e) {
    console.error('소켓이 닫혔어요 ㅜㅜ');
};


function alarm() {
    if (payload_parse.user_id != author_id) {
        const message = `<img src="https://cdn-icons-png.flaticon.com/512/1827/1827422.png" class="modal-icon"><a style="cursor:pointer;margin:auto; text-decoration:none;" href="review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}">
        <p class="alarm-content">후기에 덧글이 달렸습니다.</p></a>`
        notificationSocket.send(JSON.stringify({
            'message': message,
            "author": author_id,
            "user_id": payload_parse.user_id
        }))
    }
}


// review 신고 POST
async function post_review_report() {
    const review_report_category = document.getElementById("review_report_category")
    const review_report_value = (review_report_category.options[review_report_category.selectedIndex].value)

    const reportData = {
        category: review_report_value,
        content: document.getElementById("review_report_content").value,
    }

    const response = await fetch(`http://127.0.0.1:8000/reviews/details/${place_id}/${review_id}/`, {

        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(reportData)
    })
    const result = await response.json()

    if (response.status === 200) {
        alert(result['message'])
    }

    if (response.status === 208) {
        alert(result['message'])
    }

    if (response.status === 400 && result['content']) {
        alert(result['content'])
    }
}

// comment 신고 POST
async function post_comment_report(cmt_id) {
    console.log(cmt_id)
    const comment_report_category = document.getElementById(`comment-report-category${cmt_id}`)
    const comment_report_value = (comment_report_category.options[comment_report_category.selectedIndex].value)

    const reportData = {
        category: comment_report_value,
        content: document.getElementById(`comment-report-content${cmt_id}`).value,
    }
    console.log(document.getElementById(`comment-report-content${cmt_id}`).value)

    const response = await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${cmt_id}/`, {

        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(reportData)
    })
    const result = await response.json()

    if (response.status === 200) {
        alert(result['message'])
    }

    if (response.status === 208) {
        alert(result['message'])
    }

    if (response.status === 400 && result['content']) {
        alert(result['content'])
    }
}

// recomment 신고 POST
async function post_recomment_report(comment_id, recmt_id) {
    const recomment_report_category = document.getElementById(`recomment-report-category${recmt_id}`)
    const recomment_report_value = (recomment_report_category.options[recomment_report_category.selectedIndex].value)
    console.log(recomment_report_value)

    const reportData = {
        category: recomment_report_value,
        content: document.getElementById(`recomment-report-content${recmt_id}`).value,
    }
    console.log(document.getElementById(`recomment-report-content${recmt_id}`).value)

    const response = await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/${comment_id}/recomments/${recmt_id}/`, {

        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(reportData)
    })
    const result = await response.json()

    if (response.status === 200) {
        alert(result['message'])
    }

    if (response.status === 208) {
        alert(result['message'])
    }

    if (response.status === 400 && result['content']) {
        alert(result['content'])
    }
}
