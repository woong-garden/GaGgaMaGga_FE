const getnickname = location.href.split('=')[1]
const user_nickname = decodeURI(getnickname)

if(localStorage.getItem("access")){
    public_profile()
} else{
    alert("로그인 후 이용해주세요")
    location.replace("login.html")
}

// 공개프로필
async function public_profile() {
    const response = await fetch(`${backendBaseUrl}/users/profiles/${user_nickname}/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access"),
        }})


    response_json = await response.json()
    console.log(response_json)


    // 프로필
    const profile_nickname = document.getElementById("profile_nickname")
    const profile_intro = document.getElementById("profile_intro")
    const profile_followers = document.getElementById("profile_followers")
    const profile_followings = document.getElementById("profile_followings")
    
    profile_nickname.innerText = response_json.nickname
    profile_intro.innerText = response_json.intro
    profile_followers.innerText = response_json.followers.length
    profile_followings.innerText = response_json.followings.length

    // 프로필 이미지
    const profile_image = document.getElementById("profile_image")
    let image_url = response_json.profile_image
    profile_image.setAttribute("src", `${backendBaseUrl}${image_url}`)

    var my_id = JSON.parse(localStorage.getItem(['payload'])).user_id
    var profile_id = response_json.user_id


    // 후기
    if(response_json.review_set.length){
        response_json.review_set.forEach(item => {
        $('#my-review').append(
            `
            <div class="review-box">
                <div class="row" style="margin:0;">
                    <div class="col-md-4" style="padding:0;">
                        <img class="review-img" onclick="move_review_detail_page(${item.id},${item.place.id})" alt="후기 사진" src="${backendBaseUrl}${item.review_image_one}">
                    </div>
                    <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                        <div class="card-body">
                            <h6 style="cursor:pointer;color:  #ffbf60;" onclick="move_review_detail_page(${item.id},${item.place.id},${item.author_id})">${item.place_name}</h6>
                            <p>평점&nbsp; ${item.rating_cnt} / 5</p>
                            <div style="display:flex; width:50%;">`+
                            (my_id == profile_id? '<button class="update-review" onclick="move_to_edit_page(${item.place_id}, ${item.id})">리뷰 수정</button> <button class="update-review" onclick="delete_review(${item.place_id}, ${item.id})">리뷰 삭제</button>':'')
                        +`</div>
                    </div>
                </div>
            </div>
            `
        )
    });
    }
    
    // 북마크
    if(response_json.bookmark_place.length){
        response_json.bookmark_place.forEach(item => {
                $('#my-bookmark').append(
                    `
                    <div class="review-box">
                        <div class="row" style="margin:0;">
                            <div class="col-md-4" style="padding:0;">
                                <div class="content-img">
                                    <img class="review-img" onclick="move_place_detail_page(${item.id})" alt="장소 사진" src="${item.place_img}">
                                </div>
                            </div>
                            <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                                <div onclick="move_place_detail_page(${item.id})" style="padding: 1.25rem">
                                    <h6 style="color : #ffbf60;">${item.place_name}</h6>
                                    <p>평점&nbsp; ${item.rating} / 5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                )
            });
    }
    
    // 본인 프로필에서 팔로우 버튼 숨김
    if (profile_id == my_id){
        document.getElementById('user_follow').style.display ="none"
    }else{
        document.getElementById("user_follow").innerHTML = "팔로우"
        document.getElementById("profile_followers").value = "1"
    }
    // 팔로우 되어있을 때 버튼
    let follow_list = response_json.followers
    for (const item of follow_list){
        if (my_id==item.id){
            document.getElementById("user_follow").innerHTML = "팔로우취소"
            document.getElementById("profile_followers").value = "0"
        }
        
    }
}

// 팔로우
$('#user_follow').on('click', follow);

function follow(){
    $.ajax({
        url : `${backendBaseUrl}/users/follow/${user_nickname}/`,
        type : 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization","Bearer " + localStorage.getItem("access"));
        },
        success: function(res){
            var profile_followers = document.getElementById("profile_followers").innerText;
            var follower_value = document.getElementById("profile_followers").value;
            if(follower_value == 1){
                var rrr = parseInt(profile_followers) +1;
                document.getElementById("profile_followers").innerText = rrr;
                document.getElementById("profile_followers").value = 0;
                document.getElementById("user_follow").innerHTML = "팔로우취소"
            }else{
                var rrr = parseInt(profile_followers) -1;
                document.getElementById("profile_followers").innerText = rrr;
                document.getElementById("profile_followers").value = 1;
                document.getElementById("user_follow").innerHTML = "팔로우"
            }
        }
    });
}
    
function reviewshow(){
    $('#my-review').show();
    $('#my-bookmark').hide();
}
function bookmarkshow(){
    $('#my-review').hide();
    $('#my-bookmark').show();
}

function move_follow_page(user_nickname){
    var value = document.getElementById('follower_move').value;
    window.location.href = `/follow.html?id=${user_nickname}?value=${value}`
}
function move_following_page(user_nickname){
    var value = document.getElementById('following_move').value;
    window.location.href = `/follow.html?id=${user_nickname}?value=${value}`
}

function move_review_detail_page(review_id,place_id, author_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}`
}

function move_place_detail_page(place_id){
    window.location.href = `/place_detail.html?id=${place_id}`
}

function move_to_edit_page(place_id, review_id){
    window.location.href = `/review_update.html?place_id=${place_id}&review_id=${review_id}`
}

function delete_review(place_id, review_id){
    fetch(`http://127.0.0.1:8000/reviews/details/${place_id}/${review_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'DELETE',
    })
    public_profile()
    document.querySelector('.profile-button').click()
}
