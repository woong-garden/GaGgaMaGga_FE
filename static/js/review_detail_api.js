window.onload = () => {
    getComments()

}

// 전체 코멘트 데이터 불러오기
async function getComments() {
    const review_id = 1 //추후 후기의 id 연동해야 합니다.

    const response = await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())
    console.log(response)
}


//코멘트 등록, 나중에 페이지 생성시 덧글 등록 버튼에 onclick으로 이 함수를 달아주면 됩니다.
async function postComment() {
    const content = document.querySelector(".input_comment").value
    // 후에 만들어질 html에서 덧글 등록 input 태그의 class가 .input_comment라고 가정하고 만들었습니다.
    const review_id = 1 // 마찬가지로 추후 연동시켜야 합니다.
    console.log(content)

    await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/`, {
        headers:{
            'content-type':'application/json',
            "authorization" : "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
        body : JSON.stringify({
            "content" : content,
        })
    })
    alert("덧글 등록")
}