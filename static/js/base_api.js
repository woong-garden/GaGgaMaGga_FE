// const backendBaseUrl = "https://www.back-gaggamagga.tk"
const backendBaseUrl = "http://127.0.0.1:8000"
const frontendBaseUrl = "http://127.0.0.1:5500"

if (localStorage.getItem("payload") || localStorage.getItem("kakao")) {
    access_verify_token()
}

async function access_verify_token() {

    const response = await fetch(
        `${backendBaseUrl}/users/api/token/verify/`,
        { 
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({"token": localStorage.getItem("access")})
        }
    )
    if (response.status === 200) { 

    }
    if (response.status === 401){
        refresh_verify_token()
        
    }
}

async function refresh_verify_token() {

    const response = await fetch(
        `${backendBaseUrl}/users/api/token/verify/`,
        { 
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({"token": localStorage.getItem("refresh")})
        }
    )
    if (response.status === 200) { 
        access_token_get()
    }
    if (response.status === 401){
        localStorage.clear()
        window.location.reload()
    }
}


async function access_token_get() {

    const response = await fetch(
        `${backendBaseUrl}/users/api/token/refresh/`,
        { 
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({"refresh": localStorage.getItem("refresh")})
        }
    )
    const response_json = await response.json()
    if (response.status === 200) {
        if(localStorage.getItem("kakao")){
        localStorage.removeItem("access")
        localStorage.removeItem("kakao")
        localStorage.setItem("access", response_json.access); 

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );
        localStorage.setItem("kakao", jsonPayload);
        window.location.reload()

} else if(localStorage.getItem("payload")){
    localStorage.removeItem("access")
    localStorage.removeItem("payload")
    localStorage.setItem("access", response_json.access); 

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function (c) {
            return '%' + (
                '00' + c.charCodeAt(0).toString(16)
            ).slice(-2);
        }).join('')
    );
    localStorage.setItem("payload", jsonPayload);
    window.location.reload()
}}}

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


