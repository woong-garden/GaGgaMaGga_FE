if (localStorage.getItem("kakao") || localStorage.getItem("playload")){
    location.replace(history.back())
    alert("이미 로그인이 되어있습니다.")
} else {}

function to_signup(){
    location.href = "signup.html"
}

function to_login(){
    location.href = "login.html"
}
