if(localStorage.getItem("access")){
    private_profile()
} else{
    alert("접근이 불가능합니다.")
    location.replace("index.html")
}

//프로필 수정
async function profile_edit() {

    let image = document.querySelector("#profile_image")
    let nickname = document.getElementById("nickname").value
    let intro = document.getElementById("intro").value
    let profile_image = image.files[0]
    let formData = new FormData()

    formData.append("profile_image", profile_image)
    formData.append("nickname", nickname)
    formData.append("intro", intro)
    
    const response = await fetch(`${backendBaseUrl}/users/profiles/`, {
    method: "PUT",
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: formData
    })

    const result = await response.json()
    console.log(result
        )
    if (response.status === 200) {
        alert("회원정보 수정이 완료되었습니다.")
        window.location.replace(`private_profile.html`)
        
    } else if (response.status === 400) {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['password']}`
        
    }  else if(response.status == 403) {
        alert("접근이 불가능합니다.")
        window.location.replace(`login.html`)
    }
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

    const nickname = document.getElementById("nickname")
    const intro = document.getElementById("intro")
    const profile_image = document.getElementById("profile_image")

    nickname.value = response_json.nickname
    intro.innerText = response_json.intro

    // console.log(response_json.profile_image.slice('/')[3])
    // console.log(response_json.profile_image)

}
