
window.onload = function(){
    console.log("연결완료")
    const cate_id = location.href.split('=')[1].split('/')[0]
    PlaceSelectView(cate_id)
    }

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    
    
    
    
    
    
    
    
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

    function reload_page(){
        location.reload(true);
    }

//select
async function PlaceSelectView(choice_no){
    const response = await fetch(`http://127.0.0.1:8000/places/selection/${choice_no}/`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
        }
    })
    response_json = await response.json()
    console.log(response_json)
    if (choice_no > 12) {
        $('#select-box').empty()
        response_json.forEach(item => {
            $('#select-box').append(
                `
                <a href="#"><div class="select_box" style="background-image:url(${item.place_img});" onclick=move_list_page("${item.category}",${item.id})>
                    <p class="p_name">${item.category}</p>
                </div></a>
                `
            )
        });
    } else {
        $('#select-box').empty()
        response_json.forEach(item => {
            $('#select-box').append(
                `
                <a href="#"><div class="select_box" style="background-image:url(${item.place_img});" onclick=move_list_page("${item.category}",${item.id})>
                    <p class="p_name">${item.place_name}</p>
                </div></a>
                `
            )
        });
    }
}

function move_list_page(category, place_id){ 
    window.location.href = `/place_list.html?$place=${place_id}&cate=${category}/`
}

