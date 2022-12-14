// 모달창 열기
function openModal() {
    const modalBox = document.querySelector('#modal-box')
    modalBox.style.display = "block"
}


// 모달창 닫기
function closeModal() {
    const modalBox = document.querySelector('#modal-box')
    modalBox.style.display = "none"
}


// 알람 
const notificationSocket = new WebSocket(
    'ws://'
    + "127.0.0.1:8000"
    + '/ws/notification/'
    +  JSON.parse(localStorage.getItem("payload")).user_id
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
    

    const response = await fetch(`http://127.0.0.1:8000/notification/${ JSON.parse(localStorage.getItem("payload")).user_id}/`, {
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



getNotification()
async function getNotification() {

    const response = await fetch(`http://127.0.0.1:8000/notification/${ JSON.parse(localStorage.getItem("payload")).user_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())
    response.forEach(notification => {
        const alarmBox = document.querySelector('.alarm')


        let alarmContent = document.createElement('div')
        alarmContent.setAttribute("id", `alarm${notification.id}`)
        alarmContent.innerHTML = notification.content
        alarmContent.style.display = "flex"
        alarmContent.style.height = "10vh"
        alarmBox.appendChild(alarmContent)

        // const alarmButton = `<button onclick="read(${notification.id})"></button>`
        const notificationButton = document.createElement('button')
        const notificationButtonText = document.createTextNode('확인')
        notificationButton.appendChild(notificationButtonText)
        notificationButton.onclick = async function () {
            await fetch(`http://127.0.0.1:8000/notification/alarm/${notification.id}/`, {
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
    })
}