window.onload = function () {
    BestLikeSort(1)
}

async function BestLikeSort(page){
    const response = await fetch(`http://127.0.0.1:8000/reviews/review_rank/?page=${page}`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            // "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)
    const rank_cnt = document.getElementById("rank-cnt")
    rank_cnt.innerText = response_json.like_count_review.results.length
    
    // 페이지네이션
    const page_no = response_json.like_count_review.next.split('=')[1].split('/')[0]
    const last_page_no = parseInt(response_json.like_count_review.count/10)
    if (page_no-1 == 1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    } else if (page_no-1 == 2)  {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else if (page_no-1 == last_page_no) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            >
        `
    )
    } else if (page_no-1 == last_page_no-1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="BestLikeSort(1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="BestLikeSort(${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="BestLikeSort(${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    }
    $('#like-rank').empty()
    response_json.like_count_review.results.forEach(item => {
        
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
    

    $('#recent-rank').empty()

    
    response_json.recent_review.results.forEach(item => {
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
