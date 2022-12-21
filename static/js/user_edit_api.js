if(localStorage.getItem("payload")){} else if (localStorage.getItem("kakao")){
    alert("카카오 회원은 회원정보 수정이 불가합니다.")
    window.location.replace("private_profile.html")
} else{
    alert("접근 불가합니다.")
    window.location.replace("private_profile.html")
}
    
//회원정보 수정
async function user_edit() {
    const phone_number_front = document.getElementById("phone_number_front")
    const phone_number_front_value = (phone_number_front.options[phone_number_front.selectedIndex].value)  
    const phone_number_1 = document.getElementById("phone_number_1").value
    const phone_number_2 = document.getElementById("phone_number_2").value

    const user_edit_data = {
        email: document.getElementById("email").value,
        phone_number: phone_number_front_value + phone_number_1 + phone_number_2,
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
        window.location.replace('private_profile.html')

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
private_profile()
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
    
    const email = document.getElementById("email")
    const phone_number_1 = document.getElementById("phone_number_1")
    const phone_number_2 = document.getElementById("phone_number_2")

    email.value = response_json.email
    if (response_json.phone_number == null) {} 
    else{
        phone_number_1.value =response_json.phone_number.slice(3, 7)
        phone_number_2.value =response_json.phone_number.slice(7, 11)}
}

