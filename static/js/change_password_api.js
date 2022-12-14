if(localStorage.getItem("access")){
} else{
    alert("접근이 불가능합니다.")
    window.location.replace("index.html")
}


//비밀번호 변경
async function password_change() {
    const password_change_data = {
        repassword: document.getElementById("repassword").value,
        password: document.getElementById("password").value,
    }

    const response = await fetch(`${backendBaseUrl}/users/password-change/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'PUT',
        body: JSON.stringify(password_change_data)
    })

    const result = await response.json()
    
    if (response.status === 200) {
        alert(result['message'])
        localStorage.removeItem("kakao")
        localStorage.removeItem("payload")
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        window.location.replace('login.html')

    } else if (response.status === 400) {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['password']}`
    }
}