if (localStorage.getItem("kakao") || localStorage.getItem("playload")){
    location.replace(history.back())
    alert("이미 로그인이 되어있습니다.")
} else {}

//휴대폰 인증번호 발송
async function phone_number_send() {
    const phone_number_send_data = {
        phone_number: document.getElementById("phone_number").value,
    }

    const response = await fetch(`${backendBaseUrl}/users/phone-number-send/`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'POST',
        body: JSON.stringify(phone_number_send_data)
    })

    const result = await response.json()
    console.log(result)
    
    if (response.status === 200) {
        alert("인증번호가 발송되었습니다. 확인부탁드립니다.")

    } else if (response.status === 400) {
        document.getElementById('alert-danger_1').style.display ="block"
        const alert_danger_1 = document.getElementById('alert-danger_1')
        alert_danger_1.innerText = `${result['message']}`

        
    }
}

//인증번호 확인
async function auth_number_confirm() {
    const auth_number_confirm_data = {
        phone_number: document.getElementById("phone_number").value,
        auth_number: document.getElementById("auth_number").value,
    }

    const response = await fetch(`${backendBaseUrl}/users/phone-number-confirm/`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'POST',
        body: JSON.stringify(auth_number_confirm_data)
    })

    const result = await response.json()
    console.log(result)
    
    if (response.status === 200) {
        alert(result['message'])

    } else if (response.status === 400) {
        document.getElementById('alert-danger_2').style.display ="block"
        const alert_danger_2 = document.getElementById('alert-danger_2')
        alert_danger_2.innerText = `${result['message']}`
    }
}


function to_signup(){
    location.href = "signup.html"
}

function to_login(){
    location.href = "login.html"
}
