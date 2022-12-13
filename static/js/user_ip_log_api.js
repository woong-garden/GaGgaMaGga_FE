
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);


if(localStorage.getItem("access")){
    login_log() 
} else{
    alert("접근이 불가능합니다.")
    window.location.replace("index.html")
}

function time2str(date) {
    let date_time = new Date(date)

    return `${date_time.getFullYear()}년 ${date_time.getMonth() + 1}월 ${date_time.getDate()}일 ${date_time.getHours()}시 ${date_time.getMinutes()}분`
};




// 알람 
console.log(payload_parse.user_id)
const notificationSocket = new WebSocket(
    'ws://'
    + "127.0.0.1:8000"
    + '/ws/notification/'
    + payload_parse.user_id
    + '/'
);

notificationSocket.onmessage = async function (e) {
    const data = JSON.parse(e.data);
    const alarmBox = document.querySelector('.alarm')


        const alarmContent = document.createElement('div')
        alarmContent.style.display = "flex"
        alarmContent.style.height = "10vh"
        alarmContent.innerHTML = data.message
        alarmBox.appendChild(alarmContent)


    const response = await fetch(`http://127.0.0.1:8000/notification/${payload_parse.user_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())

    const notificationButton = document.createElement('button')
    const notificationButtonText = document.createTextNode('확인')
    notificationButton.appendChild(notificationButtonText)
    notificationButton.onclick = async function () {
        await fetch(`http://127.0.0.1:8000/notification/alarm/${response[0].id}/`, {
            headers: {
                'content-type': 'application/json',
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body: ''
        })
        alarmBox.innerHTML = ""
        getNotification()
    }
    alarmContent.appendChild(notificationButton)

    alarmBox.appendChild(alarmContent)
};

notificationSocket.onclose = function (e) {
    console.error('소켓이 닫혔어요 ㅜㅜ');
};




async function login_log(){
    const response = await fetch(`${backendBaseUrl}/users/logs/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )

    response_json = await response.json()
    response_json.forEach(item => {
        const time_format = time2str(item.created_at)
        console.log(item.created_at)
        $('#my-review').append(
            `
            <div class="card" style="margin-bottom:12px">
            <div class="row">
                <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                    <div class="card-body">
                        <h6 style="font-size:15px">접속 ip: ${item.update_ip}</h6></h6> 
                        <h6 style="font-size:15px">접속 시간: ${time_format}</h6></h6>
                    </div>
                </div>
            </div>
        </div>
            `
        )
    })
}
