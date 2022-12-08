if (localStorage.getItem("kakao")){
} else if (location.href.split('=')[1]){
    const kakao_code = location.href.split('=')[1]
    kakaoLoginApi(kakao_code)
}
if(localStorage.getItem("payload")){
    if (JSON.parse(localStorage.getItem("payload")).password_expired == true){
        expired_password_confirm()
    }
}

//카카오 로그인 back으로 전달
async function kakaoLoginApi(kakao_code) {
    const response = await fetch(`http://127.0.0.1:8000/users/kakao/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"code":kakao_code}),
    })
    response_json = await response.json()

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
        localStorage.setItem("kakao", jsonPayload);
    }else {
        alert(response_json['error'])
        window.history.back()
}}

//유저 비밀번호 만료 확인
async function expired_password_confirm() {

    const response = await fetch(`${backendBaseUrl}/users/password-expired-change/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    })

    const result = await response.json()

    if (response.status === 200) {
        alert(result['message'])
        location.replace('expired_password.html')
    } 
}