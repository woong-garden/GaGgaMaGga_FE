if(localStorage.getItem("payload")){
} else if (localStorage.getItem("kakao")){
    alert("카카오 회원은 회원정보 수정이 불가합니다.")
    location.replace("private_profile.html")
} else{
    alert("접근 불가합니다.")
    location.replace("private_profile.html")
}

//회원정보 수정
async function user_edit() {
    const user_edit_data = {
        email: document.getElementById("email").value,
        phone_number: document.getElementById("phone_number").value,
    }

    const response = await fetch(`${backendBaseUrl}/users/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'PUT',
        body: JSON.stringify(user_edit_data)
    })

    const result = await response.json()

    if (response.status === 200) {
        alert(result['message'])
        location.replace('private_profile.html')

    } else if (response.status === 400 && result['email']) {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['email']}`

    } else if (response.status === 400 && result['phone_number']) {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['phone_number']}`
    }
}