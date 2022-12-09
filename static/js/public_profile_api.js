console.log("프로필 페이지!")
const getnickname = location.href.split('=')[1]
const user_nickname = decodeURI(getnickname)

// const user_nickname = "admin"

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
                            <img alt="장소 사진" src="${backendBaseUrl}${item.review_image_one}" style="width: 100%; height:100%; aspect-ratio: 1/1;
                                    object-fit: cover;" >
                        </div>
                    </div>
                    <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                        <div class="card-body">
                            <h6>${item.place_name}</h6>
                            <p class="card-text">평점&nbsp; ${item.rating_cnt} / 5</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        )
    });
console.log(response_json.bookmark_place)
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


    

    
}

public_profile()

function reviewshow(){
    $('#my-review').show();
    $('#my-bookmark').hide();
}
function bookmarkshow(){
    $('#my-review').hide();
    $('#my-bookmark').show();
}