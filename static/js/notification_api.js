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


getNotification()
async function getNotification() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const user_id = payload_parse.user_id

    const response = await fetch(`http://127.0.0.1:8000/notification/${user_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
    .then(response => response.json())
    console.log(response)

    response.forEach(notification => {
        console.log(notification)
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