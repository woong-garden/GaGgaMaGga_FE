const active_user = document.getElementById("active_user")
const deacctive_user = document.getElementById("deactive_user")
const profile_div = document.getElementById("profile_div")

if(localStorage.getItem("access")){
    private_profile()
    active_user.style = "display:block;"
    deacctive_user.style = "display:none;"
    profile_div.style = "display:block;padding:14px 30px 0px 30px; display: flex; align-items: center;"
    
} else {
    active_user.style = "display:none;"
    deacctive_user.style= "display:block;"
    profile_div.style = "display:none"
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
    const h6_profile_nickname = document.getElementById("profile_nickname")
    const h6_profile_username = document.getElementById("profile_username")
    const h6_profile_email = document.getElementById("profile_email")

    h6_profile_nickname.innerText = `닉네임: ${response_json.nickname}`
    h6_profile_username.innerText = `아이디: ${response_json.username}`
    h6_profile_email.innerText = `이메일: ${response_json.email}`
    document.getElementById("porfile-img").src = `${backendBaseUrl}${response_json.profile_image}`

    let google_inquiry = document.getElementById("google_inquiry")

    //1:1문의
    google_inquiry.onclick = async function() {
        console.log(response_json.is_confirmed)
        if (localStorage.getItem("access")){
            if (localStorage.getItem("payload")){
                if(response_json.is_confirmed == true){
                    google_inquiry = document.getElementById("google_inquiry")
                    google_inquiry.href = "https://docs.google.com/forms/d/1Q8tbNOfQ_5UJn4exL7YJ8n7LfbwAC8tNcTYaGq9cad8/edit"
                } else if(response_json.is_confirmed == false){
                    alert("문의를 작성하시려면 이메일 인증을 해야합니다.")
                }
            } else if (localStorage.getItem("kakao")) {
                google_inquiry = document.getElementById("google_inquiry")
                google_inquiry.href = "https://docs.google.com/forms/d/1Q8tbNOfQ_5UJn4exL7YJ8n7LfbwAC8tNcTYaGq9cad8/edit"
            }}}}


// 내 프로필
function move_profile_page(){
    var profile_nickname = document.getElementById("profile_nickname").innerText
    profile_nickname = profile_nickname.split(' ')[1]
    window.location.href = `/public_profile.html?=${profile_nickname}`
}

//회원정보 수정 카카오 로그인은 접근 불허
function confirm_kakao_user_edit() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 회원정보 수정을 할 수 없습니다. ")}
    else{
        window.location.replace('user_edit.html')
        }
}

//비밀번호 변경 카카오 로그인 접근 불허
function confirm_kakao_change_password() {
    if (localStorage.getItem("kakao")){
        alert("카카오 회원은 비밀번호를 설정할 수 없습니다. ")}
    else{
        window.location.replace('change_password.html')
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
    alert("60일간 보관되며, 60일 경과된 후 모든 개인정보는 자동삭제되고 로그인 할 시 계정 비활성화가 해제됩니다." )
    localStorage.removeItem("kakao")
    localStorage.removeItem("nickname")
    localStorage.removeItem("review_cnt")
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    window.location.replace('login.html')}
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
            localStorage.removeItem("nickname")
            localStorage.removeItem("review_cnt")
            alert("로그아웃 완료")
            window.location.replace('login.html')

        } else if (response.status === 400) {

        alert("토큰이 유효하지 않습니다.")

        } else if (response.status === 403) {
        alert("접근 권한이 없습니다.")
        }
}}