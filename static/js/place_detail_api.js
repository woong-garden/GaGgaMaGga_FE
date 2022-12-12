

async function PlaceDetail(){
    const response = await fetch(`http://127.0.0.1:8000/places/7/`,{
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

    place_image.src =  response_json[0].place_img
    div_place_name.innerText = response_json[0].place_name
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



async function review_like_sort(){
    const response = await fetch(`http://127.0.0.1:8000/reviews/1/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)

    const rank_cnt = document.getElementById("place-review-cnt")
    rank_cnt.innerText = response_json.like_count_review.length

    response_json.like_count_review.forEach(item => {
        $('#like-rank').append(
            `
            <a class="review-box-wrap" onclick="move_review_detail_page(${item.id},${item.place_id})">
                <div class="review-item-user">
                    <img src="${backendBaseUrl}${item.profile_image}">
                    <div>
                        ${item.nickname}
                    </div>
                </div>
                <div>
                    <div class="review-item-date">
                        ${item.created_at}
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
    const response = await fetch(`http://127.0.0.1:8000/reviews/1/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)

    response_json.recent_review.forEach(item => {
        $('#recent-rank').append(
            `
            <a class="review-box-wrap" onclick="move_review_detail_page(${item.id},${item.place_id})">
                <div class="review-item-user">
                    <img src="${backendBaseUrl}${item.profile_image}">
                    <div>
                        ${item.nickname}
                    </div>
                </div>
                <div>
                    <div class="review-item-date">
                        ${item.created_at}
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


function move_review_detail_page(review_id,place_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}`

}
