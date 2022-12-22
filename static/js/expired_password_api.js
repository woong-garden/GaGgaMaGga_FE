// if (JSON.parse(localStorage.getItem("payload")).password_expired == true){

// } else {
//     window.location.replace("index.html")
// }

//비밀번호 인증 만료시 변경
async function expired_password_change() {
    const expired_password_change_data = {
        confirm_password: document.getElementById("confirm_password").value,
        repassword: document.getElementById("repassword").value,
        password: document.getElementById("password").value,
    }

    const response = await fetch(`${backendBaseUrl}/users/password-expired-change/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'PUT',
        body: JSON.stringify(expired_password_change_data)
    })

    const result = await response.json()
    
    if (response.status === 200) {
        alert(result['message'])

    } else if (response.status === 400) {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['password']}`
    }
}

//비밀번호 다음에 변경하기
async function expired_password_next_change() {
    const response = await fetch(`${backendBaseUrl}/users/password-expired-change/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'POST',
    })

    const result = await response.json()
    
    if (response.status === 200) {
        window.location.replace('index.html')
    }
}