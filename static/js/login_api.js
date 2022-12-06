
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


function kakao_login_code(){
    const kakao_id ='d7803b6c144bfb2dc3ce3e1dc7028d8a'
    const redirect_uri = 'http://127.0.0.1:5500/login.html'
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code`
    const kakao_code = location.href.split('=')[1]
    kakaoLoginApi(kakao_code)
}

async function kakaoLoginApi(kakaoUserData) {
    console.log(kakaoUserData)
    const response = await fetch(`http://127.0.0.1:8000/users/kakao/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"code":kakaoUserData}),
    })
    response_json = await response.json()
    console.log(response_json)

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
    }else {
        alert(response_json['error'])
}}

