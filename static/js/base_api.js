const backendBaseUrl = "https://www.back-gaggamagga.tk"
// const backendBaseUrl = "http://127.0.0.1:8000"
// const frontendBaseUrl = "http://127.0.0.1:5500"
const frontendBaseUrl = "http://192.168.219.104:5500"

if (localStorage.getItem("payload") || localStorage.getItem("kakao")) {
    if (localStorage.getItem("payload")){
        const exp = new Date(JSON.parse(localStorage.getItem("payload")).exp * 1000);
        if (exp < new Date()){
            localStorage.clear()
        }
    } else if(localStorage.getItem("kakao")){
        const exp = new Date(JSON.parse(localStorage.getItem("kakao")).exp * 1000);
        if (exp < new Date()){
            localStorage.clear()
        }
}}

async function move_profile_page(){
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
    var user_nickname = response_json.nickname
    window.location.href = `/public_profile.html?=${user_nickname}`
}

function move_best_review_page(page, choice){
    window.location.href = `/best_review_list.html?page=${page}&choice=${choice}`
}



//모바일 환경 스크롤
const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`)
    };
    window.addEventListener('resize', setVh);
setVh();


