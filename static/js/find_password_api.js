if (localStorage.getItem("kakao") || localStorage.getItem("payload")){
    window.location.replace("index.html")
    alert("이미 로그인이 되어있습니다.")
} else {}
    
//비밀번호 찾기
async function password_find() {
    const password_find_data = {
        email: document.getElementById("email").value,
    }

    const response = await fetch(`${backendBaseUrl}/users/password-reset-email/`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'POST',
        body: JSON.stringify(password_find_data)
    })

    const result = await response.json()
    
    if (response.status === 200) {
        alert("비밀번호 재설정 이메일을 발송했습니다. 확인부탁드립니다. ")

    } else if (response.status === 400) {
        document.getElementById('alert-danger').style.display ="block"
        const key = Object.keys(result)[0];
        makeAlert(key, result[key][0]);
    }
}

//알람 뜨게
function makeAlert(key, errorText){
    if (document.getElementsByClassName("alert-danger")[0]){
        const alert_div = document.getElementsByClassName("alert-danger")[0];
        alert_div.innerText = `${errorText}`
    } else {
    const alert_div = document.createElement("div");
    const signup_form = document.getElementsByClassName("signup")[0];
    alert_div.setAttribute("class", "alert-danger");
    alert_div.innerText = `${errorText}`;
    const signup_button = signup_form.childNodes[8];
    signup_form.insertBefore(alert_div, signup_button); }
}

function to_signup(){
    window.location.href = "signup.html"
}

function to_login(){
    window.location.href = "login.html"
}



