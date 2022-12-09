const review_id = location.href.split('=')[1].split('&')[0]
const place_id = location.href.split('=')[2]

window.onload = () => {
    getData(review_id, place_id)

}



// 모달창 열기
function openModal() {
    const modalBox = document.querySelector('#modal-box')
    const header = document.querySelector('.header')
    const main = document.querySelector('.root')
    const nav = document.querySelector('.nav-wrap')

    modalBox.style.display = "block"
    header.style.display = "none"
    main.style.display = "none"
    nav.style.display = "none"
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
    console.log(response)

    const content = document.querySelector('.review-detail-box p')
    content.innerText = response.content

    const date = document.querySelector('.review-detail-box div p')
    date.innerText = response.created_at

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
        commentHead.appendChild(nickname)

        const time = document.createElement('p')
        time.classList.add('time')
        time.innerText = cmt.created_at
        commentHead.appendChild(time)

        const dots = document.createElement('img')
        dots.src = "/images/icon/dot.svg"
        commentHead.appendChild(dots)

        const commentText = document.createElement("p")
        commentText.innerText = cmt.content
        commentContent.appendChild(commentText)

        const commentUnder = document.createElement("div")
        commentUnder.classList.add("comment-under")
        commentContent.appendChild(commentUnder)

        const commentLike = document.createElement("img")
        commentLike.src = "/images/icon/review_et_heart.svg"
        commentUnder.appendChild(commentLike)

        const commentLikeCount = document.createElement("p")
        commentLikeCount.innerText = cmt.comment_like_count
        commentUnder.appendChild(commentLikeCount)

        const recomment = document.createElement("div")
        recomment.classList.add('recomment')
        recomment.style.justifyContent = "space-between"
        recomment.style.margin = "1vh 1.5vw"
        commentContent.appendChild(recomment)

        const insertRecomment = document.createElement('button')
        var txt = document.createTextNode('답글 달기')
        insertRecomment.appendChild(txt)
        insertRecomment.classList.add('cmt-btn')
        commentUnder.appendChild(insertRecomment)
        insertRecomment.onclick = function () {
            recomment.classList.toggle('show-recomment')
        }




        const recommentImg = document.createElement('img')
        recommentImg.src = "http://127.0.0.1:8000" + response.profile_image
        recomment.appendChild(recommentImg)

        const recommentInput = document.createElement('input')
        recommentInput.placeholder = "답글 달기"
        recommentInput.type = "text"
        recomment.appendChild(recommentInput)

        const recommentButton = document.createElement('button')
        var text = document.createTextNode('등록')
        recommentButton.appendChild(text)
        recomment.appendChild(recommentButton)



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
    let content = document.querySelector(".nav-input-wrap input").value

    await postComment(review_id, content)

    getData(review_id, place_id)
    content = ""
}

// 알람 
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const user_id = payload_parse.user_id

console.log("connect1")

const notificationSocket = new WebSocket(
    'ws://'
    + "127.0.0.1:8000"
    + '/ws/notification/'
    + user_id
    + '/'
);



notificationSocket.onmessage = function (e) {
    console.log("connect2")
    const data = JSON.parse(e.data);
    const alarmBox = document.querySelector('.alarm')


    const alarmContent = document.createElement('div')
    alarmContent.innerHTML =`<div style="display:flex; height:10vh;">
        <img src="https://cdn-icons-png.flaticon.com/512/1827/1827422.png" class="modal-icon">
        <p class="alarm-content">${data.message}</p>
    </div>`
    alarmBox.appendChild(alarmContent)
};


notificationSocket.onclose = function (e) {
    console.log("connect3")
    console.error('소켓이 닫혔어요 ㅜㅜ');
};


document.querySelector('#button').onclick = function (e) {
    console.log("connect4")
    const message = "덧글이 달렸습니다."
    notificationSocket.send(JSON.stringify({
        'message': message

    }))
    console.log('send')
}