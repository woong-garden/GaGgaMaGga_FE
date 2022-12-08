

async function BestLikeSort(){
    const response = await fetch(`http://127.0.0.1:8000/reviews/review_rank/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    const rank_cnt = document.getElementById("rank-cnt")
    rank_cnt.innerText = response_json.like_count_review.length

    response_json.like_count_review.forEach(item => {
        console.log(item)
        $('#like-rank').append(
            `
            <div class="review-list">
                <div class="place-item">
                    <div>
                        <img style="width:100px;height:100px; cursor: pointer;" onclick="move_review_detail_page(${item.id},${item.place.id})" src="${backendBaseUrl}${item.review_image_one}">
                    </div>
                    <div class="place-item-content">
                        <div>${item.place_name}</div>
                        <div class="place-item-content-cntsty">
                            <div>
                                좋아요 ${item.review_like_count}
                            </div>
                            <div>
                                별점 ${item.rating_cnt}
                            </div>
                        </div>
                    </div>
                </div>
                <a style="cursor: pointer;" onclick="move_public_profile_page('${item.nickname}')" class="review-item-user">
                    <div>
                        <img style="width:40px;height:40px; border-radius: 20px;" src="${backendBaseUrl}${item.profile_image}">
                    </div>
                    <div>
                        ${item.nickname}
                    </div>
                </a>
            </div>
            `
        )
    })

}
BestLikeSort()


async function recentSort(){
    const response = await fetch(`http://127.0.0.1:8000/reviews/review_rank/`,{
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
            <div class="review-list">
                <div class="place-item">
                    <div>
                        <a style="cursor: pointer;" onclick="move_review_detail_page(${item.id},${item.place_id})">
                            <img style="width:100px;height:100px;" src="${backendBaseUrl}${item.review_image_one}">
                        </a>
                    </div>
                    <div class="place-item-content">
                        <div>${item.place_name}</div>
                        <div class="place-item-content-cntsty">
                            <div>
                                좋아요 ${item.review_like_count}
                            </div>
                            <div>
                                별점 ${item.rating_cnt}
                            </div>
                        </div>
                    </div>
                </div>
                <a style="cursor: pointer;" onclick="move_public_profile_page('${item.nickname}')" class="review-item-user">
                    <div>
                        <img style="width:40px;height:40px; border-radius: 20px;" src="${backendBaseUrl}${item.profile_image}">
                    </div>
                    <div>
                        ${item.nickname}
                    </div>
                </a>
            </div>
            `
        )
    })

}
recentSort()


function move_review_detail_page(review_id,place_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}`

}

function move_public_profile_page(nickname){
    window.location.href = `/public_profile.html?id=${nickname}`
}
