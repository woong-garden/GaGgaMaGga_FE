const review_id = location.href.split('?')[1].split('&')[0].split('=')[1]
const place_id = location.href.split('?')[1].split('&')[1].split('=')[1]
const author_id = location.href.split('?')[1].split('&')[2].split('=')[1]

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);

window.onload = () => {
    getData(review_id, place_id)
}
const modalBox = document.querySelector('#modal-box')
const header = document.querySelector('.header')
const main = document.querySelector('.root')
const nav = document.querySelector('.nav-wrap')
// 모달창 열기
function openModal() {

    modalBox.style.display = "block"
}


// 모달창 닫기
function closeModal() {
    const modalBox = document.querySelector('#modal-box')
    const header = document.querySelector('.header')
    const main = document.querySelector('.root')
    const nav = document.querySelector('.nav-wrap')

    modalBox.style.display = "none"
    header.style.display = "block"
    main.style.display = "block"
    nav.style.display = "block"
}


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
    date.innerText = `작성 시간 : ${response.created_at}`
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
        time.innerText = cmt.created_at
        time.style.fontSize = "11px"
        time.style.color = "gray"
        commentHead.appendChild(time)

        // 신고 모달창 trigger
        const dots = document.createElement('img')
        dots.src = "/images/icon/dot.svg"
        dots.style.cursor = "pointer"
        commentHead.appendChild(dots)
        const reportModal = document.querySelector('#report-modal')
        dots.onclick = function(){
            reportModal.style.display = "block"

        }
        const closeReportModal = document.querySelector('#report-modal h4:nth-child(2)')
        closeReportModal.onclick = function(){
            reportModal.style.display = "none"
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
            recmtContentBox.appendChild(recommentText)


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



            if (recmt.nickname == payload_parse.nickname) {

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
        if (payload_parse.nickname == cmt.nickname) {
            const editComment = document.createElement('button')
            var editText = document.createTextNode('덧글 수정')
            editComment.appendChild(editText)
            editComment.classList.add('cmt-btn')
            commentUnder.appendChild(editComment)


            // 덧글 수정 인풋
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



notificationSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const alarmBox = document.querySelector('.alarm')


    const alarmContent = document.createElement('div')
    alarmContent.innerHTML = `<div style="display:flex; height:10vh;">
        <img src="https://cdn-icons-png.flaticon.com/512/1827/1827422.png" class="modal-icon">
        <p class="alarm-content">${data.message}</p>
        <button>확인</button>
    </div>`
    alarmBox.appendChild(alarmContent)
};


notificationSocket.onclose = function (e) {
    console.error('소켓이 닫혔어요 ㅜㅜ');
};


function alarm() {
    if (payload_parse.user_id != author_id) {
        const message = "게시글에 덧글이 달렸습니다."
        notificationSocket.send(JSON.stringify({
            'message': message,
            "author": author_id,
            "user_id": payload_parse.user_id

        }))
    }
}