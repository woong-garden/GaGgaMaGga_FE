if (localStorage.getItem("kakao") || localStorage.getItem("payload")){
    window.location.replace("index.html")
}

window.onload = function load_page(){
    const confirm = localStorage.getItem("confirm")

    if (confirm === "true"){
        window.location.href = "login.html"
    }
}

function move_login(){
    window.location.href = "login.html"
    localStorage.setItem("confirm", true)
}