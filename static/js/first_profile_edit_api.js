if(localStorage.getItem("access")){
    if (JSON.parse(localStorage.getItem("payload")).nickname == null){
    }else{
    window.location.replace("index.html")
}
} else{
    alert("접근이 불가능합니다.")
    window.location.replace("login.html")
}

//프로필 수정
async function first_profile_edit() {

    let image = document.querySelector("#profile_image")
    let profile_image = image.files[0]
    let nickname = document.getElementById("nickname").value
    let intro = document.getElementById("intro").value
    let formData = new FormData()

    if (profile_image){
        formData.append("profile_image", profile_image)
    }

    formData.append("nickname", nickname)
    formData.append("intro", intro)
    if (nickname == ""){
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `닉네임을 입력해주세요.`
    } else{

    const response = await fetch(`${backendBaseUrl}/users/profiles/`, {
    method: "PUT",
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: formData
    })

    const result = await response.json()

    if (response.status === 200) {
        window.location.replace(`index.html`)
        
    } else if (response.status === 400 && result['nickname']) {
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${result['nickname']}`
    
    } else if (response.status === 400 && result['profile_image']){
        document.getElementById('alert-danger').style.display ="block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `이미지를 넣어주세요. `
        
    } else if(response.status == 403) {
        alert("접근이 불가능합니다.")
        window.location.replace(`login.html`)
    }
}}