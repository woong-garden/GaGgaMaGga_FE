const getnickname = location.href.split('=')[1]
const user_nickname = decodeURI(getnickname)

// 공개프로필
async function follow() {
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
    profile_nickname.innerText = response_json.nickname

    // 팔로워
    response_json.followers.forEach(item => {
    console.log(response_json.followers)
    $('#follower').append(
        `
        <div class="profile">
            <div class = "img">
                <img id="porfile-img" src ="${backendBaseUrl}${item.profile_image}" alt="프로필 사진" >
            </div>
            <div style="width: 77%;">
                <a>${item.nickname}</a>
            </div>
        </div>
        `
    )
    });
 
    
    

    // 팔로잉
    response_json.followings.forEach(item => {
        $('#following').append(
            `
            <div class="profile">
                <div class = "img">
                    <img id="porfile-img" src ="${backendBaseUrl}${item.profile_image}" alt="프로필 사진" >
                </div>
                <div style="width: 77%;">
                    <a>${item.nickname}</a>
                </div>
            </div>
            `
        )
    });

    
}

follow()

function followershow(){
    $('#follower').show();
    $('#following').hide();
}
function followingshow(){
    $('#follower').hide();
    $('#following').show();
}
