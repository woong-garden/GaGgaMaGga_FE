if (localStorage.getItem("kakao")){
} else {
    const kakao_code = location.href.split('=')[1]
    kakaoLoginApi(kakao_code)
}

//카카오 로그인 back으로 전달
async function kakaoLoginApi(kakaoUserData) {
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
        localStorage.setItem("kakao", jsonPayload);
        location.replace('index.html')
    }else {
        alert(response_json['error'])
        window.history.back()
}}