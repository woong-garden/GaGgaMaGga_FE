const getnickname = location.href.split('=')[1]
const user_nickname = decodeURI(getnickname)

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

    // 후기
    response_json.review_set.forEach(item => {
        console.log(item)
        $('#my-review').append(
            `
            <div class="card" style="margin-bottom:10px;">
                <div class="row" style="margin:0;">
                    <div class="col-md-4" style="padding:0;">
                            <img onclick="move_review_detail_page(${item.id},${item.place.id})" alt="후기 사진" src="${backendBaseUrl}${item.review_image_one}" style="cursor:pointer;width: 100%;border-top-left-radius:5px;border-bottom-left-radius:5px; height:100%; aspect-ratio: 1/1;
                                    object-fit: cover;" >
                    </div>
                    <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                        <div class="card-body">
                            <h6 style="cursor:pointer;color:  #ffbf60;" onclick="move_review_detail_page(${item.id},${item.place.id},${item.author_id})">${item.place_name}</h6>
                            <p class="card-text">평점&nbsp; ${item.rating_cnt} / 5</p>
                            <div style="display:flex; width:50%;">
                            <button class="update-review" onclick=move_to_edit_page(${item.place_id}, ${item.id})>리뷰 수정</button>
                            <button class="update-review">리뷰 삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        )
    });
    // 북마크

    if(response_json.bookmark_place.length){
        response_json.bookmark_place.forEach(item => {
                $('#my-bookmark').append(
                    `
                    <div class="card">
                        <div class="row">
                            <div class="col-md-4" >
                                <div class="content-img">
                                    <img alt="장소 사진" src="${item.place_img}" style="width: 100%; height:100%; aspect-ratio: 1/1;
                                            object-fit: cover;" >
                                </div>
                            </div>
                            <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                                <div class="card-body">
                                   <h6 style="color :  #ffbf60;">${item.place_name}</h6>
                                    <p class="card-text">평점&nbsp; ${item.rating} / 5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                )
            });
    }
    
    
    // 본인 프로필에서 팔로우 버튼 숨김
    let nickname = JSON.parse(localStorage.getItem(['payload'])).nickname
    if (user_nickname == nickname){
        document.getElementById('user_follow').style.display ="none"
    } 
    else {
        document.getElementById("user_follow").innerHTML = "팔로우"
        document.getElementById("profile_followers").value = "1"

    }

    // 팔로우 되어있을 때 버튼
    let follow_list = response_json.followers
    for (const item of follow_list){
        console.log(item.nickname);
        if (nickname==item.nickname){
            document.getElementById("user_follow").innerHTML = "팔로우취소"
            document.getElementById("profile_followers").value = "0"
        }
    }
}

public_profile()

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
            console.log(follower_value)
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
    console.log(value)
    window.location.href = `/follow.html?id=${user_nickname}?value=${value}`
}
function move_following_page(user_nickname){
    var value = document.getElementById('following_move').value;
    window.location.href = `/follow.html?id=${user_nickname}?value=${value}`
}

function move_review_detail_page(review_id,place_id, author_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}&author=${author_id}`
}

function move_to_edit_page(place_id, review_id){
    window.location.href = `/review_update.html?place_id=${place_id}&review_id=${review_id}`
}

