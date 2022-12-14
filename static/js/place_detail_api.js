
if(localStorage.getItem("access")){
} else{
    alert("로그인 후 이용해주세요")
    location.replace("login.html")
}


const place_id = location.href.split('?')[1].split('=')[1]

async function PlaceDetail(){
    const response = await fetch(`${backendBaseUrl}/places/${place_id}/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            }
        }
    )
    response_json = [await response.json()]
    
    const menu_list = response_json[0].menu.split('|')
    const place_name = response_json[0].place_name

    const div_place_name = document.getElementById("place-name")
    const div_place_address = document.getElementById("div_place_address")
    const div_place_number = document.getElementById("div_place_number")
    const div_place_time = document.getElementById("div_place_time")
    const place_image = document.getElementById("place_image")
    const place_bookmarks = document.getElementById("place_bookmarks")
    const review_createa_div = document.getElementById("review_createa_div")

    if (localStorage.getItem("payload")){
        if (response_json[0].place_bookmark.indexOf(JSON.parse(localStorage.getItem("payload")).user_id) == 0){
            place_bookmarks.src = '/images/icon/bookmark2.svg'
        } else if(response_json[0].place_bookmark.indexOf(JSON.parse(localStorage.getItem("payload")).user_id) == -1) {
            place_bookmarks.src = '/images/icon/bookmark.svg'
    }}

    if(localStorage.getItem("kakao")){
        if (response_json[0].place_bookmark.indexOf(JSON.parse(localStorage.getItem("kakao")).user_id) == 0){
            place_bookmarks.src = '/images/icon/bookmark2.svg'
        } else if(response_json[0].place_bookmark.indexOf(JSON.parse(localStorage.getItem("kakao")).user_id) == -1) {
            place_bookmarks.src = '/images/icon/bookmark.svg'
    }}

    if (localStorage.getItem("access")){
        place_bookmarks.style = "display:block;"
        review_createa_div.style = "display:block;"
    } else{
        place_bookmarks.style = "display:none;"
        review_createa_div.style = "display:none;"
    }
    
    if(response_json[0].place_img == null){
        place_image.src = "https://www.anyang.go.kr/DATA/board/2018/6/30/4d583737-fac7-4b97-a481-a4ade1a3fe8e.jpg"
    }else{
        place_image.src =  response_json[0].place_img
    }

    
    div_place_name.innerText = `${response_json[0].place_name}(${response_json[0].hit})`
    div_place_address.innerText = `주소: ${response_json[0].place_address}`
    div_place_number.innerText = `전화번호: ${response_json[0].place_number}`
    div_place_time.innerText = `영업시간: ${response_json[0].place_time}`


    menu_list.forEach(item => {
        $('#menu-list').append(
            `
            <div class="menu-list-box">
                <div class="menu-list-content">
                    <div id="menu-name" class="menu-list-content-title">
                        ${item}
                    </div>
                    <div>
                    ${place_name}
                    </div>
                </div>
            </div>
            `
        )
    })
}
PlaceDetail()

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
    return `${new Date(date_now).getFullYear()}년 ${new Date(date_now).getMonth() + 1}월 ${new Date(date_now).getDate()}일`
};



async function review_like_sort(){

    const response = await fetch(`${backendBaseUrl}/reviews/${place_id}/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    const rank_cnt = document.getElementById("place-review-cnt")
    rank_cnt.innerText = response_json.like_count_review.length
    response_json.like_count_review.forEach(item => {
        $('#like-rank').append(
            `
            <a class="review-box-wrap" onclick="move_review_detail_page(${item.id},${item.place_id},${item.author_id})">
                <div class="review-item-user">
                    <img src="${backendBaseUrl}${item.profile_image}">
                    <div>
                        ${item.nickname}
                    </div>
                </div>
                <div>
                    <div class="review-item-date">
                    ${time2str(item.created_at)}
                    </div>
                    <div class="review-item-content">
                        ${item.content}
                    </div>
                    <div class="rating">
                        <img src="/images/icon/star.svg">
                        <div>${item.rating_cnt}</div>
                        <div class="review-item-box">
                            <img src="/images/icon/review_fill_heart.svg">
                            <div> ${item.review_like_count}</div>
                        </div>
                    </div>
                </div>
            </a>
            `
        )
    })
}
review_like_sort()


async function review_recent_sort(){
    const response = await fetch(`${backendBaseUrl}/reviews/${place_id}/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    response_json.recent_review.forEach(item => {
        $('#recent-rank').append(
            `
            <a class="review-box-wrap" onclick="move_review_detail_page(${item.id},${item.place_id},${item.author_id})">
                <div class="review-item-user">
                    <img src="${backendBaseUrl}${item.profile_image}">
                    <div>
                        ${item.nickname}
                    </div>
                </div>
                <div>
                    <div class="review-item-date">
                        ${time2str(item.created_at)}
                    </div>
                    <div class="review-item-content">
                        ${item.content}
                    </div>
                    <div class="rating">
                        <img src="/images/icon/star.svg">
                        <div>${item.rating_cnt}</div>
                        <div class="review-item-box">
                            <img src="/images/icon/review_fill_heart.svg">
                            <div> ${item.review_like_count}</div>
                        </div>
                    </div>
                </div>
            </a>
            `
        )
    })
}
review_recent_sort()

//북마크 POST
async function place_bookmarks() {
    const response = await fetch(`${backendBaseUrl}/places/${place_id}/bookmarks/`, {
        method: 'POST',
        headers: {
            Accept:"application/json",
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
    }
    )
    response_json = await response.json()

    const place_bookmarks = document.getElementById("place_bookmarks")

    if (response_json["message"]=='북마크를 했습니다.' ){
        place_bookmarks.src = '/images/icon/bookmark2.svg'

    } else if (response_json["message"]=='북마크를 취소했습니다.'){
        place_bookmarks.src = '/images/icon/bookmark.svg'
    }

}



function move_review_detail_page(review_id,place_id,author_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}`
}

function move_review_create_page(place_id){
    window.location.href = `/review_create.html?id=${place_id}`
}