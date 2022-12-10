

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


        const alarmContent = document.createElement('div')
        alarmContent.innerHTML =`<div style="display:flex; height:10vh;">
            <img src="https://cdn-icons-png.flaticon.com/512/1827/1827422.png" class="modal-icon">
            <p class="alarm-content">${notification.content}</p>
            <button onclick="read(${notification.id});">확인</button>
        </div>`
        alarmBox.appendChild(alarmContent)
        // alarmContent.style.display = "flex"
        // alarmContent.style.height = "10vh"
        // alarmBox.appendChild(alarmContent)

        // const alarmImage = document.createElement('img')
        // alarmImage.classList.add('modal-icon')
        // alarmImage.src = "https://cdn-icons-png.flaticon.com/512/1827/1827422.png"
        // alarmBox.appendChild(alarmImage)

        // const alarmMessage = document.createElement('p')
        // alarmMessage.classList.add('alarm-content')
        // alarmMessage.innerText = notification.content
        // alarmBox.appendChild(alarmMessage)

        // const readButton = document.createElement('button')
        // var text = document.createTextNode('확인')
        // readButton.appendChild(text)
        // readButton.appendChild(alarmBox)
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



// async function postComment(review_id, content) {


//     const response = await fetch(`http://127.0.0.1:8000/reviews/${review_id}/comments/`, {
//         headers: {
//             'content-type': 'application/json',
//             "authorization": "Bearer " + localStorage.getItem("access")
//         },
//         method: 'POST',
//         body: JSON.stringify({ // JS object is converted to string.
//             "content": content,
//         })
//     })
// }