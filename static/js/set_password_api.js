if (localStorage.getItem("kakao") || localStorage.getItem("payload")){
    location.replace(history.back())
    alert("이미 로그인이 되어있습니다.")
} else {}

//uibd와 token이 없을 때 로그인 페이지로
if (location.href.split('/')[5] || location.href.split('/')[4]){
    Check_Password()
} else{
    location.replace('login.html')}

//비밀번호 토큰, uidb64 확인
async function Check_Password() {
    const token = location.href.split('/')[5]
    const uidb64 = location.href.split('/')[4]

    const response = await fetch(`${backendBaseUrl}/users/password-reset/${uidb64}/${token}`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'GET',
    })

    const result = await response.json()
    if (response.status === 401) {
        alert(result["message"])
        location.replace('login.html')
    }
}

//비밀번호 재설정
async function Set_Password() {
    const token = location.href.split('/')[5]
    const uidb64 = location.href.split('/')[4]
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;
    const response = await fetch(`${backendBaseUrl}/users/password-reset-complete/`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({"password":password, "repassword":repassword, "uidb64":uidb64, "token":token})
    })

    const result = await response.json()

    if (response.status === 200) {
        alert(result["message"])
        location.replace('login.html')
        
    } else if (response.status == 401){
        alert("링크가 유효하지 않습니다.")

    } else {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['password']}`
    }
}

function to_signup(){
    location.href = "signup.html"
}

function to_login(){
    location.href = "login.html"
}
