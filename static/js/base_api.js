const backendBaseUrl = "http://127.0.0.1:8000"
const frontendBaseUrl = "http://127.0.0.1:5555"

function move_profile_page(){
    let nickname = JSON.parse(localStorage.getItem(['payload'])).nickname
    window.location.href = `/public_profile.html?=${nickname}`
}