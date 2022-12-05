
//로그인
async function Login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
        `${backendBaseUrl}/users/api/token/`,
        { 
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({"username": username, "password": password})
        }
    )
    const response_json = await response.json()
    
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access); 
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );
        localStorage.setItem("payload", jsonPayload);
        location.replace('index.html')
    } else {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = "아이디와 비밀번호를 확인해주세요"
    }}

Kakao.init("f53d03593266672440d8e9324c61e5ff");
function kakaoLogin() {
    window.Kakao.Auth.login({
        scope: 'profile_nickname, account_email, profile_image',
        success: function (authObj) {
            window.Kakao.API.request({
                url: '/v2/user/me',
                success: res => {
                    kakaoAccount = res.kakao_account;
                    kakaoUserData = {
                        'email': kakaoAccount['email'],
                        'nickname': kakaoAccount['profile']['nickname'],
                        'profile_image':kakaoAccount['profile']['profile_image_url'],
                    }
                    console.log(kakaoUserData)
                    kakaoLoginApi(kakaoUserData)
                }
            });
        }
    });
}

// 소셜 유저 회원가입위해 카카오 유저 정보(이메일, 닉네임) 백엔드로 보내주기
async function kakaoLoginApi(kakaoUserData) {

    const response = await fetch(`${backEndBaseUrl}/users/kakao/kakao/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(kakaoUserData),
    }
    )
    response_json = await response.json()

    if (response.status == 200) {
        setLocalStorageItems()
        window.location.reload()

    }
}


// const callKakaoLoginHandler = () => {
//         router.push({
//         pathname: "https://kauth.kakao.com/oauth/authorize",
//         query: {
//             "response_type": "code",
//             "client_id": "f53d03593266672440d8e9324c61e5ff",
//             "redirect_uri": "http://localhost:5000/callback/kakao"
//         }
//         })
//     }
// Kakao.init("f53d03593266672440d8e9324c61e5ff")

// function loginWithKakao() {
//     Kakao.Auth.login({
//     success: function(authObj) {
//         alert(JSON.stringify(authObj))
//     },
//     fail: function(err) {
//         alert(JSON.stringify(err))
//     },
//     })
// }