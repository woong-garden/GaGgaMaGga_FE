const review_id = location.href.split('?')[1].split('&')[0].split('=')[1]
const place_id = location.href.split('?')[1].split('&')[1].split('=')[1]
const author_id = location.href.split('?')[1].split('&')[2].split('=')[1]

if (localStorage.getItem("access")) { }
else {
    alert("로그인 후 이용해주세요")
    location.replace("login.html")
}
let payload_parse
if (localStorage.getItem("payload")) {
    payload = localStorage.getItem("payload");
    payload_parse = JSON.parse(payload);
}
else if (localStorage.getItem("kakao")) {
    payload_parse = JSON.parse(localStorage.getItem("kakao"));
}

window.onload = () => {
    // getNotification() //알람

    // 엔터로만 덧글 등록
    document.querySelector(".nav-input-wrap input").focus();
    document.querySelector(".nav-input-wrap input").onkeyup = function (e) {
        if (e.keyCode === 13) {
            document.querySelector('#button').click();
        }
    }

    // 본인 게시글에서 후기 게시글 신고 버튼 감추기
    if (payload_parse.user_id == author_id){
        document.querySelector('#report-button-text').style.display = "none"
    }

    // 후기 신고 모달창 trigger
    const closeReportModal = document.querySelector('#exit-report')
    const reportModal = document.querySelector('#report-modal')
    document.querySelector('#report-button-text').onclick = function () {
        reportModal.style.display = "block"
    }
    closeReportModal.onclick = function () {
        reportModal.style.display = "none"
    }
    closeReportModal.onclick = function () {
        reportModal.style.display = "none"
    }
    private_profile()
    getData(review_id, place_id)
    getComments()
}

const modalBox = document.querySelector('#modal-box')
const header = document.querySelector('.header')
const main = document.querySelector('.root')
const nav = document.querySelector('.nav-wrap')

// 알람 모달창 여닫기
function openModal() {
    modalBox.style.display = "block"
}
function closeModal() {
    modalBox.style.display = "none"
}

// 작성자 띄우기
async function private_profile() {
    const author = await fetch(`${backendBaseUrl}/reviews/details/${place_id}/${review_id}/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    }
    )
    author_json = await author.json()

    document.querySelector('#author-image').src = backendBaseUrl + author_json.profile_image
    document.querySelector('#author-image').onclick = function () {
        location.href = `public_profile.html?=${author_json.nickname}`
    }
    document.querySelector('#author p').innerText = author_json.nickname
    document.querySelector('#author p').onclick = function () {
        location.href = `public_profile.html?=${author_json.nickname}`
    }

    if(document.querySelector('.recomment img')){
        document.querySelector('.recomment img').src = backendBaseUrl + author_json.profile_image
    }
}

//시간 포맷팅
function time2str(date_now) {
    let date_now_1 = new Date(date_now)
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
    return `${date_now_1.getFullYear()}년 ${date_now_1.getMonth() + 1}월 ${date_now_1.getDate()}일`
};

async function getData(review_id, place_id) {
    const response = await fetch(`${backendBaseUrl}/reviews/details/${place_id}/${review_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())

    console.log(response)

    // 사진 개수만큼 사진 띄우기
    let total = 0
    let exampleImage
    let imageContent = document.querySelector('#image-content')
    if (response.review_image_one == null){
        document.querySelector('#author').style.borderBottom = "1px solid rgba(0, 0, 0, 0.192)"
        document.querySelector('#image-content').style.display = "none"
        document.querySelector('#image-buttons').style.display = "none"
    } else{
        exampleImage = [backendBaseUrl + response.review_image_one]
        imageContent.src = backendBaseUrl + response.review_image_one
        document.querySelector('#prev').style.display = "none"
        document.querySelector('#next').style.display = "none"
        total += 1
        document.querySelector('#curr').innerText = 1
    }

    if (response.review_image_two){
        exampleImage.push(backendBaseUrl + response.review_image_two)
        document.querySelector('#prev').style.display = "block"
        document.querySelector('#next').style.display = "block"
        document.querySelector('#image-buttons').style.width = "100%"
        total += 1
    }
    if (response.review_image_three){
        exampleImage.push(backendBaseUrl + response.review_image_three)
        total += 1
    }

    document.querySelector('#total').innerText = total
    let i = 0;
    console.log(total)

    function prevImage() {
        i--;
        imageContent.src = exampleImage[i];
        if (i<0){
            i = exampleImage.length-1;
            imageContent.src = exampleImage[i];
        }
        document.querySelector('#curr').innerText = i+1;
    }

    function nextImage() {
        i ++;
        imageContent.src = exampleImage[i];
        if (i >= exampleImage.length){
            i = 0;
            imageContent.src = exampleImage[i];
        }
        document.querySelector('#curr').innerText = i+1;
    }

    document.querySelector('#prev').addEventListener('click',() => {
        prevImage()
    })
    document.querySelector('#next').addEventListener('click',() => {
        nextImage()
    })
    

    // 이미지 null 값일때 디폴트 이미지 설정
    // const firstImage = document.querySelector('.slidelist li:nth-child(1) img')
    // const secondImage = document.querySelector('.slidelist li:nth-child(2) img')
    // const thirdImage = document.querySelector('.slidelist li:nth-child(3) img')
    // if (response.review_image_one) { firstImage.src = backendBaseUrl + response.review_image_one }
    // else { firstImage.src = 'https://www.anyang.go.kr/DATA/board/2018/6/30/4d583737-fac7-4b97-a481-a4ade1a3fe8e.jpg' }
    // if (response.review_image_two) { secondImage.src = backendBaseUrl + response.review_image_two }
    // else { secondImage.src = 'https://www.anyang.go.kr/DATA/board/2018/6/30/4d583737-fac7-4b97-a481-a4ade1a3fe8e.jpg' }
    // if (response.review_image_three) { thirdImage.src = backendBaseUrl + response.review_image_three }
    // else { thirdImage.src = 'https://www.anyang.go.kr/DATA/board/2018/6/30/4d583737-fac7-4b97-a481-a4ade1a3fe8e.jpg' }

    // 좋아요 여부에 따른 하트 모양 바꾸기
    if (response.review_like.includes(payload_parse.user_id)) {
        document.querySelector('.comment-cnt img').src = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
    }
    else {
        document.querySelector('.comment-cnt img').src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
    }

    // 장소 제목 및 맛집 링크
    document.querySelector('h3').innerText = response.place_name
    document.querySelector('#title-link').href = `place_detail.html?id=${place_id}`

    // 게시글 정보 연동
    document.querySelector('.review-detail-box p').innerText = response.content // 내용
    document.querySelector('.review-time p').innerText = `마지막 작성 시간 : ${time2str(response.updated_at)}` // 작성 날짜
    document.querySelector('#comment-count').innerText = response.review_comments.length // 덧글 수
    document.querySelector('#like-count').innerText = response.review_like.length // 좋아요 수
}



// 전체 코멘트 띄우기
const comments = document.querySelector('.comments')
async function getComments() {
    const response = await fetch(`${backendBaseUrl}/reviews/details/${place_id}/${review_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
        .then(response => response.json())

    response.review_comments.forEach(cmt => {
        // 개별 코멘트
        const eachComment = document.createElement("div")
        eachComment.classList.add("each-comment")
        comments.appendChild(eachComment)

        // 코멘트 작성자 프로필
        const profileImg = document.createElement('img')
        profileImg.classList.add('comment-user-img')
        profileImg.src = backendBaseUrl + cmt.profile_image
        profileImg.style.cursor = "pointer"
        profileImg.onclick = function () {
            location.href = `public_profile.html?=${cmt.nickname}`
        }
        eachComment.appendChild(profileImg)

        // 코멘트 내용이 담길 div
        const commentContent = document.createElement("div")
        commentContent.classList.add(`comment-content${cmt.id}`)
        eachComment.appendChild(commentContent)

        // 작성자 닉네임과 작성시간
        const commentHead = document.createElement("div")
        commentHead.classList.add("comment-head")
        commentContent.appendChild(commentHead)
        const nickname = document.createElement('p')
        nickname.classList.add('nickname')
        nickname.innerText = cmt.nickname
        nickname.onclick = function () {
            location.href = `public_profile.html?=${cmt.nickname}`
        }
        commentHead.appendChild(nickname)
        const time = document.createElement('p')
        time.classList.add('time')
        time.innerText = time2str(cmt.updated_at)
        commentHead.appendChild(time)

        if(payload_parse.user_id != cmt.user_id){
        // 코멘트 신고 버튼
        const dots = document.createElement('span')
        dots.innerText = "신고"
        dots.classList.add('recomment-report-button')
        dots.style.cursor = "pointer"
        dots.onclick = function () {
            document.querySelector('#comment-report').style.display = "block"
            document.querySelector('#comment-report').removeAttribute('class')
            document.querySelector('#comment-report').classList.add(`${cmt.id}`)
        }
        commentHead.appendChild(dots)
    }

        // 코멘트 내용
        const commentText = document.createElement("p")
        commentText.innerText = cmt.content
        commentText.classList.add(`p${cmt.id}`)
        commentContent.appendChild(commentText)
        const commentUnder = document.createElement("div")
        commentUnder.classList.add("comment-under")
        commentContent.appendChild(commentUnder)

        // 덧글 좋아요
        const commentLike = document.createElement("img")
        commentLike.classList.add('comment-like-img')
        commentLike.style.cursor = "pointer"
        commentLike.onclick = async function () {
            await fetch(`${backendBaseUrl}/reviews/comments/${cmt.id}/likes/`, {
                headers: {
                    'content-type': 'application/json',
                    "authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
            })
            getData(review_id, place_id)
            comments.innerHTML = ""
            getComments()
        }
        commentUnder.appendChild(commentLike)

        // 덧글 좋아요 하트 모양
        if (cmt.comment_like.includes(payload_parse.user_id)) {
            commentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
        }
        else {
            commentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
        }

        // 덧글 좋아요 개수
        const commentLikeCount = document.createElement("p")
        commentLikeCount.innerText = cmt.comment_like_count
        commentUnder.appendChild(commentLikeCount)

        // 답글 여닫기 버튼
        const insertRecomment = document.createElement('img')
        insertRecomment.src = "https://cdn-icons-png.flaticon.com/512/3034/3034023.png"
        insertRecomment.style.width = "5%"
        insertRecomment.classList.add('cmt-btn')
        insertRecomment.classList.add(`recomment-toggle${cmt.id}`)
        commentUnder.appendChild(insertRecomment)
        // }

        // 전체 대댓글이 담길 div
        const recommentContent = document.createElement("div")
        recommentContent.classList.add(`recomment-content${cmt.id}`)
        recommentContent.setAttribute("id",`${cmt.id}`)
        commentContent.appendChild(recommentContent)

        // 대댓글 입력창이 들어갈 div
        const recomment = document.createElement("div")
        recomment.classList.add(`recomment${cmt.id}`)
        recomment.classList.add("recomment")
        recomment.classList.add('hide-recomment')
        // recomment.style.justifyContent = "space-between"
        commentContent.appendChild(recomment)

        // 대댓글 입력창
        const recommentInput = document.createElement('input')
        recommentInput.placeholder = "답글 달기"
        recommentInput.classList.add(`input-recomment${cmt.id}`)
        recommentInput.type = "text"
        recomment.appendChild(recommentInput)

        // 대댓글 작성자 프로필 사진
        const recommentImg = document.createElement('img')
        recommentImg.style.verticalAlign = "middle"
        recommentInput.parentNode.insertBefore(recommentImg, recommentInput)

        insertRecomment.onclick = async function () {
            const userResponse = await fetch(`${backendBaseUrl}/users/profiles/`, {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("access")
                }
            }
            )
            userResponseJson = await userResponse.json()
            recommentImg.src = backendBaseUrl + userResponseJson.profile_image
        }

        insertRecomment.addEventListener('click', () => {
            showRecomments(cmt.id)
        });

        // 대댓글 등록
        const recommentButton = document.createElement('button')
        var text = document.createTextNode('등록')
        recommentButton.appendChild(text)
        recomment.appendChild(recommentButton)
        recommentButton.addEventListener('click', () => {
            writeRecomment(cmt.id)
        })

        if (payload_parse.user_id == cmt.user_id) {
            // 댓글 수정 버튼
            const editComment = document.createElement('button')
            var editText = document.createTextNode('댓글 수정')
            editComment.appendChild(editText)
            editComment.classList.add('cmt-btn')
            commentUnder.appendChild(editComment)

            const editCommentContent = document.querySelector(`.p${cmt.id}`)
            editCommentContent.style.margin = '1vh 0 1.3vh 1vw'
            // editCommentContent.style.fontSize = "13.3px"

            // 댓글 수정 input창과 등록 버튼이 담길 div
            const editBox = document.createElement('div')
            editBox.classList.add('comment-edit-box')
            editBox.classList.add('hide-recomment')
            editCommentContent.parentNode.insertBefore(editBox, editCommentContent)

            // 댓글 수정 input창
            const editInput = document.createElement('input')
            editInput.setAttribute("id", `edit-input${cmt.id}`)
            editInput.style.width = "80%"
            editBox.appendChild(editInput)
            editInput.value = editCommentContent.innerText // 기존 코멘트 내용 띄우기
            editInput.classList.add('recomment-content')

            // 댓글 수정 버튼
            const editButton = document.createElement('button')
            editButton.classList.add("edit-button")
            var editButtonText = document.createTextNode('수정')
            editButton.appendChild(editButtonText)
            editButton.style.width = "15%"
            editBox.appendChild(editButton)

            editButton.addEventListener('click', () => {
                editComments(cmt.id)
            })
            editComment.onclick = function () {
                editCommentContent.classList.toggle('hide-recomment')
                editBox.classList.toggle('hide-recomment')
            }

            // 댓글 삭제 버튼
            const delComment = document.createElement('button')
            var editText = document.createTextNode('댓글 삭제')
            delComment.appendChild(editText)
            delComment.classList.add('cmt-btn')
            commentUnder.appendChild(delComment)

            delComment.addEventListener('click', () => {
                deleteCommentFn(cmt.id)
            })
        }

        
    })
}
// 대댓글 세트 (입력창 + 대댓글 모음) 보이기
async function showRecomments(comment_id){
    document.querySelector(`.recomment-content${comment_id}`).innerHTML=""
    getRecomments(comment_id)
    document.querySelector(`.recomment${comment_id}`).classList.toggle('hide-recomment')

    document.querySelector(`.recomment-toggle${comment_id}`).onclick = function() {
        document.querySelector(`.recomment-content${comment_id}`).classList.toggle('hide-recomment')
    }

}

//대댓글 띄우기
async function getRecomments(comment_id) {
    const response = await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/recomments/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())

    const commentContent = document.querySelector(`.comment-content${comment_id}`)

    const recommentBox = document.createElement("div")
    recommentBox.style.display = "flex"
    recommentBox.style.flexDirection = "column"
    recommentBox.style.width = "100%"
    document.querySelector(`.recomment-content${comment_id}`).appendChild(recommentBox)

    response.forEach(recmt => {

        const recmtContentBox = document.createElement('div')
        recmtContentBox.style.display = "flex"
        recmtContentBox.style.justifyContent = "space-between"
        recommentBox.appendChild(recmtContentBox)
        const recommentImage = document.createElement('img')
        recommentImage.src = backendBaseUrl + recmt.profile_image
        recommentImage.style.cursor = "pointer"
        recommentImage.onclick = function () {
            location.href = `public_profile.html?=${recmt.nickname}`
        }
        recommentImage.classList.add("comment-user-img")
        recommentImage.style.margin = "1vh 0"
        recmtContentBox.appendChild(recommentImage)

        const recommentNickname = document.createElement('p')
        recommentNickname.innerText = recmt.nickname
        recommentNickname.style.cursor = "pointer"
        recommentNickname.onclick = function () {
            location.href = `public_profile.html?=${recmt.nickname}`
        }
        recommentNickname.style.fontSize = "11px"
        recommentNickname.style.margin = "auto 0.5vw"
        recommentNickname.style.color = "#FDA171"
        recmtContentBox.appendChild(recommentNickname)

        const recommentText = document.createElement("p")
        recommentText.setAttribute("id", `recmt${recmt.id}`)
        recommentText.style.fontSize = "13px"
        recommentText.style.width = "80%"
        recommentText.style.margin = "auto 0"
        recommentText.style.wordBreak = "break-all"
        recommentText.style.display = "flex"
        recmtContentBox.appendChild(recommentText)

        const realRecomment = document.createElement('span')
        realRecomment.innerText = recmt.content
        recommentText.appendChild(realRecomment)


        // 리코멘트 작성 시간
        const recmtTime = document.createElement('span')
        recmtTime.innerText = time2str(recmt.updated_at)
        recommentText.appendChild(recmtTime)
        recmtTime.style.fontSize = "11px"
        recmtTime.style.margin = "auto 0 auto 2vw"
        recmtTime.style.color = "gray"

        if(payload_parse.user_id != recmt.user_id){
        // 리코멘트 신고 버튼
        const recmtReportBtn = document.createElement('span')
        recmtReportBtn.innerText = "신고"
        recmtReportBtn.classList.add('recomment-report-button')
        recmtReportBtn.setAttribute("id", `recomment-dots${recmt.id}`)
        recommentText.appendChild(recmtReportBtn)

        recmtReportBtn.onclick = function(){
            document.querySelector('#recomment-report').style.display = "block"
            document.querySelector('#recomment-report').removeAttribute('class')
            document.querySelector('#recomment-report').classList.add(`${recmt.id}`)
        }
    }


        // 대댓글 수정 삭제 버튼 박스
        const recommentEditBox = document.createElement('div')
        recommentEditBox.classList.add('recomment-edit-box')
        recommentBox.appendChild(recommentEditBox)

        // 대댓글 좋아요
        const recommentLike = document.createElement('img')
        recommentLike.style.objectFit = "contain"
        recommentLike.style.cursor = "pointer"
        recommentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
        recommentEditBox.appendChild(recommentLike)

        recommentLike.onclick = async function () {
            await fetch(`${backendBaseUrl}/reviews/recomments/${recmt.id}/likes/`, {
                headers: {
                    'content-type': 'application/json',
                    "authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
            })
            document.querySelector(`.recomment-content${comment_id}`).innerHTML = ""
            getRecomments(comment_id)
        }

        // 대댓글 좋아요 카운트
        const recommentLikeCount = document.createElement('p')
        recommentLikeCount.innerText = recmt.recomment_like.length
        recommentLikeCount.style.fontSize = "11px"
        recommentEditBox.appendChild(recommentLikeCount)

        // 대댓글 좋아요 모양
        if (recmt.recomment_like.includes(payload_parse.user_id)) {
            recommentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107845.png"
        }
        else {
            recommentLike.src = "https://cdn-icons-png.flaticon.com/512/2107/2107952.png"
        }
        if (payload_parse.user_id == recmt.user_id) {
        recommentLike.style.width = "13%"
        // 대댓글 수정 버튼 생성
        const editRecomment = document.createElement('button')
        const editRecommentText = document.createTextNode('수정')
        editRecomment.appendChild(editRecommentText)
        editRecomment.classList.add('recmt-btn')
        editRecomment.setAttribute("id", `reEdit${recmt.id}`)
        recommentEditBox.appendChild(editRecomment)

        // 대댓글 수정 인풋 생성
        const editRecommentContent = document.querySelector(`#recmt${recmt.id} span:nth-child(1)`)
        const editRecommentInput = document.createElement('input')
        editRecommentInput.setAttribute("class", `edit-input${recmt.id}`)
        editRecommentInput.classList.add('edit-recomment-input')
        editRecommentInput.style.width = "80%"
        editRecommentInput.style.margin = "0"
        editRecommentContent.parentNode.insertBefore(editRecommentInput, editRecommentContent)
        editRecommentInput.value = editRecommentContent.innerText
        editRecommentInput.classList.add('hide-recomment')

        const editRecommentButton = document.createElement('button')
        editRecommentButton.classList.add('edit-recomment-button')
        const editRecommentText2 = document.createTextNode('수정')
        editRecommentButton.appendChild(editRecommentText2)
        editRecommentButton.classList.add('edit-button')
        editRecommentButton.classList.add('hide-recomment')
        editRecommentButton.style.marginLeft = "5%"
        editRecommentInput.after(editRecommentButton)


        editRecomment.onclick = function () {
            editRecommentInput.classList.toggle('hide-recomment')
            editRecommentButton.classList.toggle('hide-recomment')
            document.querySelector(`#recmt${recmt.id} span:nth-child(3)`).classList.toggle('hide-recomment')
            document.querySelector(`#recmt${recmt.id} span:nth-child(4)`).classList.toggle('hide-recomment')
            // if(document.querySelector(`#recmt${recmt.id} span:nth-child(5)`)){
            // document.querySelector(`#recmt${recmt.id} span:nth-child(5)`).classList.toggle('hide-recomment')}
        }

        // 대댓글 수정 기능
        editRecommentButton.addEventListener('click', () => {
            editRecommentFn(comment_id, recmt.id)
        })

        // 대댓글 삭제
        const delRecomment = document.createElement('button')
        const delRecommentText = document.createTextNode('삭제')
        delRecomment.appendChild(delRecommentText)
        delRecomment.classList.add('recmt-btn')
        recommentEditBox.appendChild(delRecomment)

        delRecomment.addEventListener('click', () => {
            removeRecomment(comment_id, recmt.id)
        })}
        else{
            recommentLike.style.width= "40%"
            recommentEditBox.style.width = "10%"
        }
    })

    document.querySelector('#recomment-report-btn').addEventListener('click', () => {
        post_recomment_report(comment_id)  
      })
}


// 후기 좋아요
async function reviewLike() {
    await fetch(`${backendBaseUrl}/reviews/${review_id}/likes/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
    })
    getData(review_id, place_id)
}


// review 신고 POST
async function post_review_report() {
    const review_report_category = document.getElementById("review_report_category")
    const review_report_value = (review_report_category.options[review_report_category.selectedIndex].value)
    const reportData = {
        category: review_report_value,
        content: document.getElementById("review_report_content").value,
    }
    const response = await fetch(`${backendBaseUrl}/reviews/details/${place_id}/${review_id}/`, {
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
    document.querySelector('#report-modal').style.display = "none"
}


// 코멘트 등록
async function postComment(review_id, content) {
    await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/`, {
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
    content.value = null
    comments.innerHTML = ""
    getComments()
}

// 코멘트 수정
async function updateComment(comment_id, content){
    await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'PUT',
        body: JSON.stringify({
            "content": content,
        })
    })
}

async function editComments(comment_id){
    let content = document.querySelector(`#edit-input${comment_id}`)
    await updateComment(comment_id, content.value)
    content.value = null
    comments.innerHTML = ""
    getComments()
}

// 댓글 삭제
async function deleteComment(comment_id){
    var deleteConfirm = confirm("댓글을 삭제하시겠습니까?")
    if (deleteConfirm){
        await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/`, {
            headers: {
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'DELETE',
        })
    }
}

async function deleteCommentFn(comment_id){
    await deleteComment(comment_id)
    comments.innerHTML = ""
    getComments()
}

// 대댓글 등록
async function postRecomment(comment_id){
    const content = document.querySelector(`.input-recomment${comment_id}`)
    await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/recomments/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
        body: JSON.stringify({ // JS object is converted to string.
            "content": content.value,
        })
    })
}

async function writeRecomment(comment_id){
    await postRecomment(comment_id)
    document.querySelector(`.input-recomment${comment_id}`).value = ""
    document.querySelector(`.recomment-content${comment_id}`).innerHTML = ""
    getRecomments(comment_id)
}

// 대댓글 삭제
async function deleteRecomment(comment_id, recomment_id){
    var delConfirm = confirm("답글을 삭제하시겠습니까?")
    if (delConfirm) {
        await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/recomments/${recomment_id}/`, {
            headers: {
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'DELETE',
        })
    }
}

async function removeRecomment(comment_id, recomment_id){
    await deleteRecomment(comment_id, recomment_id)
    document.querySelector(`.recomment-content${comment_id}`).innerHTML = ""
    getRecomments(comment_id)
}

// 대댓글 수정

async function updateRecomment(comment_id, recomment_id, content){
    await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/recomments/${recomment_id}/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'PUT',
        body: JSON.stringify({
            "content": content,
        })
    })
}

async function editRecommentFn(comment_id, recomment_id){
    let content = document.querySelector(`.edit-input${recomment_id}`)
    await updateRecomment(comment_id, recomment_id, content.value)
    content.vlaue = null
    document.querySelector(`.recomment-content${comment_id}`).innerHTML = ""
    getRecomments(comment_id)

}

// 코멘트 신고 모달창 닫기
function exitCommentReport() {
    document.querySelector('#comment-report').style.display = "none"
}

// recomment 신고 모달창 닫기
function exitRecommentReport() {
    document.querySelector('#recomment-report').style.display = "none"
}

// comment 신고 POST
async function post_comment_report() {
    const comment_report_category = document.getElementById(`comment-report-category`)
    const comment_report_value = (comment_report_category.options[comment_report_category.selectedIndex].value)
    const reportData = {
        category: comment_report_value,
        content: document.getElementById(`comment-report-content`).value,
    }

    const commentNumber = document.querySelector('#comment-report').getAttribute("class");
    const response = await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${commentNumber}/`, {
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
    document.querySelector('#comment-report').style.display = "none"
    document.querySelector('#comment-report-content').value = ""
}

// recomment 신고 POST
async function post_recomment_report(comment_id) {
    const recomment_report_category = document.getElementById(`recomment-report-category`)
    const recomment_report_value = (recomment_report_category.options[recomment_report_category.selectedIndex].value)
    const reportData = {
        category: recomment_report_value,
        content: document.getElementById(`recomment-report-content`).value,
    }

    let recommentNumber = document.querySelector('#recomment-report').getAttribute("class");
    const response = await fetch(`${backendBaseUrl}/reviews/${review_id}/comments/${comment_id}/recomments/${recommentNumber}/`, {
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
    document.querySelector('#recomment-report').style.display = "none"
    document.querySelector('#recomment-report-content').value = ""
}
















// // 알람 
// const notificationSocket = new WebSocket(
//     'wss://'
//     + "www.back-gaggamagga.tk"
//     + '/ws/notification/'
//     + author_id
//     + '/'
// );

// notificationSocket.onmessage = async function (e) {
//     const data = JSON.parse(e.data);
//     const alarmBox = document.querySelector('.alarm')
//     if (payload_parse.user_id == author_id) {
//         const alarmContent = document.createElement('div')
//         alarmContent.style.display = "flex"
//         alarmContent.style.height = "10vh"
//         alarmContent.innerHTML = data.message
//         alarmBox.appendChild(alarmContent)

//         const response = await fetch(`${backendBaseUrl}/notification/${payload_parse.user_id}/`, {
//             headers: {
//                 "authorization": "Bearer " + localStorage.getItem("access")
//             },
//             method: 'GET'
//         })
//         .then(response => response.json())
//         const notificationButton = document.createElement('button')
//         const notificationButtonText = document.createTextNode('확인')
//         notificationButton.appendChild(notificationButtonText)
//         notificationButton.onclick = async function () {
//             await fetch(`${backendBaseUrl}/notification/alarm/${response[0].id}/`, {
//                 headers: {
//                     'content-type': 'application/json',
//                     "authorization": "Bearer " + localStorage.getItem("access")
//                 },
//                 method: 'PUT',
//                 body: ''
//             })
//             alarmBox.innerHTML = ""
//             getNotification()
//         }
//         alarmContent.appendChild(notificationButton)
//     }
// };
// notificationSocket.onclose = function (e) {
//     console.error('소켓이 닫혔어요 ㅜㅜ');
// };
// function alarm() {
//     if (payload_parse.user_id != author_id) {
//         const message = `<img src="https://cdn-icons-png.flaticon.com/512/1827/1827422.png" class="modal-icon"><a style="cursor:pointer;margin:auto; text-decoration:none;" href="review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}">
//         <p class="alarm-content">후기에 덧글이 달렸습니다.</p></a>`
//         notificationSocket.send(JSON.stringify({
//             'message': message,
//             "author": author_id,
//             "user_id": payload_parse.user_id
//         }))
//     }
// }

// async function getNotification() {

//     const response = await fetch(`${backendBaseUrl}/notification/${payload_parse.user_id}/`, {
//         headers: {
//             "authorization": "Bearer " + localStorage.getItem("access")
//         },
//         method: 'GET'
//     })
//         .then(response => response.json())
//     response.forEach(notification => {
//         const alarmBox = document.querySelector('.alarm')


//         let alarmContent = document.createElement('div')
//         alarmContent.setAttribute("id", `alarm${notification.id}`)
//         alarmContent.innerHTML = notification.content
//         alarmContent.style.display = "flex"
//         alarmContent.style.height = "10vh"
//         alarmBox.appendChild(alarmContent)

//         const notificationButton = document.createElement('button')
//         const notificationButtonText = document.createTextNode('확인')
//         notificationButton.appendChild(notificationButtonText)
//         notificationButton.onclick = async function () {
//             await fetch(`${backendBaseUrl}/notification/alarm/${notification.id}/`, {
//                 headers: {
//                     'content-type': 'application/json',
//                     "authorization": "Bearer " + localStorage.getItem("access")
//                 },
//                 method: 'PUT',
//                 body: ''
//             })
//             alarmBox.innerHTML = ""
//             getNotification()

//         }

//         alarmContent.appendChild(notificationButton)
//     })
// }