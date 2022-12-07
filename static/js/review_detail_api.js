window.onload = () => {
    getData()
    // openModal()
    // closeModal()

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

    // const nickname = document.querySelector('.nickname')
    // const time = document.querySelector('.time')
    // const profileImg = document.querySelector('.comment-user-img')
    // const commentContent = document.querySelector('.comment-content')

    response.review_comments.forEach(cmt => {
        const comments = document.querySelector('.comments')
        const eachComment = document.createElement("div")
        comments.appendChild(eachComment)

        const user = document.createElement("div")
        user.classList.add("user")
        eachComment.appendChild(user)


        const profileImg = document.createElement('img')
        profileImg.classList.add('comment-user-img')
        profileImg.src = "http://127.0.0.1:8000"+ cmt.profile_image
        user.appendChild(profileImg)

        const nickname = document.createElement('p')
        nickname.classList.add('nickname')
        nickname.innerText = cmt.nickname
        user.appendChild(nickname)

        const time = document.createElement('p')
        time.classList.add('time')
        time.innerText = cmt.created_at
        user.appendChild(time)

        const dots = document.createElement('img')
        dots.src = "/images/icon/dot.svg"
        user.appendChild(dots)

        const commentWrap = document.createElement("div")
        commentWrap.classList.add("comment-wrap")
        eachComment.appendChild(commentWrap)

        const contentBox = document.createElement("div")
        commentWrap.appendChild(contentBox)

        const like = document.createElement("div")
        commentWrap.appendChild(like)
        
    });



}


//코멘트 등록, 나중에 페이지 생성시 덧글 등록 버튼에 onclick으로 이 함수를 달아주면 됩니다.
function postComment() {
    const content = document.querySelector(".nav-input-wrap input").value
    // 후에 만들어질 html에서 덧글 등록 input 태그의 class가 .input_comment라고 가정하고 만들었습니다.
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
