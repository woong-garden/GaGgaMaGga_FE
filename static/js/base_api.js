const backendBaseUrl = "http://127.0.0.1:8000"
const frontendBaseUrl = "http://127.0.0.1:5555"

let nickname = JSON.parse(localStorage.getItem(['payload'])).nickname

function move_profile_page(){
    console.log(nickname)
    window.location.href = `/public_profile.html?=${nickname}`
}