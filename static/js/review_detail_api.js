window.onload = () => {
    getData()
    // openModal()
    // closeModal()

}

// 모달창 열기
function openModal(){
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
function closeModal(){
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
async function getData() {
    const review_id = 1 //추후 후기의 id 연동해야 합니다.

    const response = await fetch(`http://127.0.0.1:8000/reviews/details/${review_id}/`, {
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


    response.review_comments.forEach(cmt => {
        const comments = document.querySelector('.comments')

        const eachComment = document.createElement("div")
        eachComment.classList.add("each-comment")
        comments.appendChild(eachComment)

        const profileImg = document.createElement('img')
        profileImg.classList.add('comment-user-img')
        profileImg.src = "http://127.0.0.1:8000"+ cmt.profile_image
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

        const commentText= document.createElement("p")
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

        const commentDetail = document.createElement("detail")
        commentUnder.appendChild(commentDetail)
        
    });



}


//코멘트 등록, 나중에 페이지 생성시 덧글 등록 버튼에 onclick으로 이 함수를 달아주면 됩니다.
function postComment() {
    const content = document.querySelector(".nav-input-wrap input").value
    const review_id = 1 // 마찬가지로 추후 연동시켜야 합니다.
    console.log(content)

    fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
        body: JSON.stringify({
            "content": content,
        })
    })
    alert("덧글 등록")
}

// 알람
// function alarm(){
//     const user_id = 1
//     const notificationSocket = new WebSocket(
//         'ws://'
//         // + window.location.host
//         +"127.0.0.1:8000"
//         + "/ws/notification/"
//         + user_id
//         + '/'
//     );


//     notificationSocket.onmessage = function (e) {
//         const data = JSON.parse(e.data);
//         const alarmBox = document.querySelector('.alarm')
//         const alarmContent = document.createElement('p')
//         alarmContent.classList.add('alarm-content')
//         alarmContent.innerHTML = data.message;
//         alarmBox.appendChild(alarmContent);
//     };
//     notificationSocket.onclose = function (e) {
//         console.error('소켓이 닫혔어요 ㅜㅜ');
//     };
//     document.querySelector('#comment-button').onclick = function (e) {
//         const message = "게시물에 덧글이 달렸습니다."
//         notificationSocket.send(JSON.stringify({
//             'message': message
//         }))
//     }
// }
