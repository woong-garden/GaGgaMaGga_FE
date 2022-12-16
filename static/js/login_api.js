if (localStorage.getItem("kakao") || localStorage.getItem("payload")){
    window.location.replace("index.html")
    alert("이미 로그인이 되어있습니다.")
} else {}
    
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
        if (JSON.parse(localStorage.getItem("payload")).nickname == null){
            window.location.replace('first_profile_edit.html')
        } else{
            window.location.replace('index.html')
        }
    } else if(response_json['non_field_errors']){
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${response_json['non_field_errors']}`
    }
    else {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = "아이디와 비밀번호를 확인해주세요"
    }}

//카카오로그인
function kakao_login_code(){
    const kakao_id ='d7803b6c144bfb2dc3ce3e1dc7028d8a'
    const redirect_uri = 'https://www.gaggamagga.shop/index.html'
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code`
}

function to_signup(){
    location.href = "signup.html"
}

function to_index(){
    location.href = "index.html"
}

function to_find_username(){
    location.href = "find_username.html"
}

function to_find_password(){
    location.href = "find_password.html"
}
