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

    // 후기
    response_json.review_set.forEach(item => {
        $('#my-review').append(
            `
            <div class="card">
                <div class="row">
                    <div class="col-md-4" >
                        <div class="content-img">
                            <a onclick="move_review_detail_page(${item.id},${item.place.id})">
                            <img alt="후기 사진" src="${backendBaseUrl}${item.review_image_one}" style="width: 100%; height:100%; aspect-ratio: 1/1;
                                    object-fit: cover;" >
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                        <div class="card-body">
                            <a onclick="move_review_detail_page(${item.id},${item.place.id})">
                            <h6>${item.place_name}</h6>
                            <p class="card-text">평점&nbsp; ${item.rating_cnt} / 5</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            `
        )
    });

    // 북마크
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
                            <h6>${item.place_name}</h6>
                            <p class="card-text">평점&nbsp; ${item.rating} / 5</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        )
    });
    
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

function move_review_detail_page(review_id,place_id){
    window.location.href = `/review_detail.html?id=${review_id}&place=${place_id}`
}


