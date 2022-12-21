if (localStorage.getItem("kakao") || localStorage.getItem("payload")){
    window.location.replace("index.html")
    alert("이미 로그인이 되어있습니다.")
} else {}
    
//회원가입
async function Sign_Up() {
    let input_check = document.getElementById("term_check");
    if (input_check.checked){
        input_check = true
    } else{
        input_check = false
    }
    
    const phone_number_front = document.getElementById("phone_number_front")
    const phone_number_front_value = (phone_number_front.options[phone_number_front.selectedIndex].value)  
    const phone_number_1 = document.getElementById("phone_number_1").value
    const phone_number_2 = document.getElementById("phone_number_2").value
    
    const signupData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        repassword: document.getElementById("repassword").value,
        phone_number: phone_number_front_value + phone_number_1 + phone_number_2,
        term_check :input_check,
    }
    const response = await fetch(`${backendBaseUrl}/users/`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'POST',
        body: JSON.stringify(signupData)
    })

    const result = await response.json()
    
    if (response.status === 201) {
        alert("회원가입이 되었습니다.")
        window.location.replace('login.html')

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
    location.href = "signup.html"
}

function to_login(){
    location.href = "login.html"
}

