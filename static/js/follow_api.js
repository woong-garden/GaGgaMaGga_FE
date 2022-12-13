


const getnickname = location.href.split('=')[1].split('?')[0]
const user_nickname = decodeURI(getnickname)
console.log(user_nickname)
const getvalue = location.href.split('=')[2]
const follow_value = decodeURI(getvalue)

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);








// 알람 
console.log(payload_parse.user_id)
const notificationSocket = new WebSocket(
    'ws://'
    + "127.0.0.1:8000"
    + '/ws/notification/'
    + payload_parse.user_id
    + '/'
);

notificationSocket.onmessage = async function (e) {
    const data = JSON.parse(e.data);
    const alarmBox = document.querySelector('.alarm')


        const alarmContent = document.createElement('div')
        alarmContent.style.display = "flex"
        alarmContent.style.height = "10vh"
        alarmContent.innerHTML = data.message
        alarmBox.appendChild(alarmContent)


    const response = await fetch(`http://127.0.0.1:8000/notification/${payload_parse.user_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())

    const notificationButton = document.createElement('button')
    const notificationButtonText = document.createTextNode('확인')
    notificationButton.appendChild(notificationButtonText)
    notificationButton.onclick = async function () {
        await fetch(`http://127.0.0.1:8000/notification/alarm/${response[0].id}/`, {
            headers: {
                'content-type': 'application/json',
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body: ''
        })
        alarmBox.innerHTML = ""
        getNotification()
    }
    alarmContent.appendChild(notificationButton)

    alarmBox.appendChild(alarmContent)
};

notificationSocket.onclose = function (e) {
    console.error('소켓이 닫혔어요 ㅜㅜ');
};



console.log(follow_value)
function followershow(){
    $('#follower').show();
    $('#following').hide();
}
function followingshow(){
    $('#follower').hide();
    $('#following').show();
}

// 팔로우
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
        console.log(item.nickname)
        $('#follower').append(
            `
            <div class="profile">
                <div class = "img">
                    <a onclick="move_user_profile('${item.nickname}')">
                    <img id="porfile-img" src ="${backendBaseUrl}${item.profile_image}" alt="프로필 사진" >
                    </a>
                </div>
                <div style="width: 77%;">
                    <a onclick="move_user_profile('${item.nickname}')">${item.nickname}</a>
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
                    <a onclick="move_user_profile('${item.nickname}')">
                    <img id="porfile-img" src ="${backendBaseUrl}${item.profile_image}" alt="프로필 사진" >
                    </a>
                </div>
                <div style="width: 77%;">
                    <a onclick="move_user_profile('${item.nickname}')">${item.nickname}</a>
                </div>
            </div>
            `
        )
    });

    if(follow_value == 'follower'){
        followershow()
    }
    else{
        followingshow()
    }
    
}

follow()

function move_user_profile(click_nickname){
    console.log(click_nickname)
    window.location.href = `/public_profile.html?=${click_nickname}`
}
// 뒤로가기
function back_profile_page(user_nickname){
    console.log(user_nickname)
    window.location.href = `/public_profile.html?=${user_nickname}`
}

