

async function BestLikeSort(){
    const response = await fetch(`http://127.0.0.1:8000/reviews/review_rank/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            // "Authorization": "Bearer " + localStorage.getItem("access")
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
                        <img class="place-item-img" onclick="move_review_detail_page(${item.id},${item.place.id},${item.author_id})" src="${backendBaseUrl}${item.review_image_one}">

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
                <a class="place-item-user" onclick="move_public_profile_page('${item.nickname}')" class="review-item-user">
                    <div>
                        <img class="place-item-user-img" src="${backendBaseUrl}${item.profile_image}">
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
            // "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    response_json.recent_review.forEach(item => {
        $('#recent-rank').append(
            `
            <div class="review-list">
                <div class="place-item">
                    <div>
                        <a onclick="move_review_detail_page(${item.id},${item.place.id})">
                            <img class="place-item-img" src="${backendBaseUrl}${item.review_image_one}">
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
                <a class="place-item-user" onclick="move_public_profile_page('${item.nickname}')" class="review-item-user">
                    <div>
                        <img class="place-item-user-img" src="${backendBaseUrl}${item.profile_image}">
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


function move_review_detail_page(review_id,place_id, author_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}`
}

function move_public_profile_page(nickname){
    window.location.href = `/public_profile.html?id=${nickname}`
}
