

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

    response.forEach(notification => {
        console.log(notification)
        const alarmBox = document.querySelector('.alarm')


        const alarmContent = document.createElement('div')
        alarmContent.innerHTML =notification.content
        alarmBox.appendChild(alarmContent)
    })
}

async function read(notification_id) {
    await fetch(`http://127.0.0.1:8000/notification/alarm/${notification_id}/`, {
        headers: {
            'content-type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'PUT',
        body: ''
    })
    getNotification()
    const alarmBox = document.querySelector('.alarm')
    alarmBox.innerHTML= ""


}