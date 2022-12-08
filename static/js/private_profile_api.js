if(localStorage.getItem("access")){
    private_profile()
}

//개인 프로필
async function private_profile(){
    
    const response = await fetch(`${backendBaseUrl}/users/profiles/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()
    console.log(response_json)
    const h6_profile_nickname = document.getElementById("profile_nickname")
    const h6_profile_username = document.getElementById("profile_username")
    const h6_profile_email = document.getElementById("profile_email")

    h6_profile_nickname.innerText = `닉네임: ${response_json.nickname}`
    h6_profile_username.innerText = `아이디: ${response_json.username}`
    h6_profile_email.innerText = `이메일: ${response_json.email}`
    document.getElementById("porfile-img").src = `${backendBaseUrl}${response_json.profile_image}`
}
//회원정보 수정 카카오 로그인은 접근 불허
function confirm_kakao_user_edit() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 회원정보 수정을 할 수 없습니다. ")}
    else{
        location.href("user_edit.html")
        }
}

// 이메일 재인증
async function resend_email() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 이메일 인증을 할 수 없습니다. ")
} else {    
    var delConfirm = confirm("이메일을 발송하시겠습니까? ")
    if (delConfirm) {
    const response = await fetch(`${backendBaseUrl}/users/email-resend/`, {
    method: "POST",
    headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("access")
    }
    })

    response_json = await response.json()

    if (response.status === 200) {
    alert(response_json["message"])
}}}}

//1:1 문의
function Report(){
    if (localStorage.getItem("access")){
        if (localStorage.getItem("payload")){
            if(JSON.parse(localStorage.getItem("payload")).is_confirmed == true){
            //구글 폼 주소
            } else{
                alert("문의를 작성하시려면 이메일 인증을 해야합니다.")
            }
        } else if (localStorage.getItem("kakao")) {
            //구글 폼 주소
        }
}}

// 계정 비활성화
async function withdrawal() {
    var delConfirm = confirm("정말 계정 비활성화를 진행하시겠습니까?")
    if (delConfirm) {
    const response = await fetch(`${backendBaseUrl}/users/`, {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })

    withdrawal_json = await response.json()
    if (response.status === 200) {
    alert(withdrawal_json["message"])
    localStorage.removeItem("kakao")
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    location.replace('login.html')}
    }
}

//로그아웃
async function logout(){
    var delConfirm = confirm("로그아웃을 하시겠습니까?")
    if (delConfirm) {
        const response = await fetch(`${backendBaseUrl}/users/logout/`, {

        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify({"refresh": localStorage.getItem("refresh")})
    })
    response_json = await response.json
        if (response.status === 200) {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            localStorage.removeItem("kakao")
            alert("로그아웃 완료")
            window.location.replace('login.html')

        } else if (response.status === 400) {

        alert("토큰이 유효하지 않습니다.")

        } else if (response.status === 403) {
        alert("접근 권한이 없습니다.")
        }
}}