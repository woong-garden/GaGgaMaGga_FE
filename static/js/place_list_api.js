
window.onload = function () {
    const storage = localStorage.getItem("payload");
    if (storage) {
        const cate_id = location.href.split('=')[1].split('/')[0]
        UserPlaceListView(cate_id, 1)
    } else {
        const place_id = location.href.split('=')[1].split('&')[0]
        const category = location.href.split('=')[2].split('/')[0]
        NewUserPlaceListView(place_id, category, 1)
    }
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




// modal
function popOpen(id) {
    var modalPop = $('#modal-wrap' + String(id));
    var modalBg = $('#modal-bg' + String(id));
    $(modalPop).show();
    $(modalBg).show();
}

function popClose(id) {
    var modalPop = $('#modal-wrap' + String(id));
    var modalBg = $('#modal-bg' + String(id));
    $(modalPop).hide();
    $(modalBg).hide();
}

//select
async function NewUserPlaceListView(place_id, category, page) {
    const response = await fetch(`http://127.0.0.1:8000/places/new/${place_id}/${category}/?page=${page}`, {    
        method: 'GET',
        headers: {
            "Content-type": "application/json",
        }
    })
    response_json = await response.json()
    console.log(response_json)

    // 페이지네이션
    const page_no = response_json.next.split('=')[1].split('/')[0]
    const last_page_no = parseInt(response_json.count/10)
    if (page_no-1 == 1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    } else if (page_no-1 == 2)  {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', 1)">1</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else if (page_no-1 == last_page_no) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', 1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            >
        `
    )
    } else if (page_no-1 == last_page_no-1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', 1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', 1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${page_no-2})">${page_no-2}</div></a>
            <a href="#"><div class="current_page">${page_no-1}</div></a>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${page_no})">${page_no}</div></a>
            <div>...</div>
            <a href="#"><div onclick="NewUserPlaceListView(${place_id}, '${category}', ${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    }

    //장소 추천 리스트
    $('#place-list').empty()
    response_json.results.forEach(item => {
        $('#place-list').append(
            `
            <table cellpadding="0" cellspacing="0" border="0">
                <td width="20%"><img src="${item.place_img}" style='width:70px;height:80px;')></td>
                <td width="70%">
                    <div style="font-size:15px;">[${item.category}] ${item.place_name}</div>
                    <div>${item.place_address}</div>
                    <div>☎${item.place_number}</div>
                    <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">지도보기</div></a>
                    <a href="#" onclick="move_place_detail_page(${item.id})"><div class="market_detail_button">상세보기</div></a>
                </td>
                <td width="10%">${item.rating}</td>
            </table>
            
            <div class="modal-bg" id="modal-bg${item.id}"onClick="javascript:popClose(${item.id});"></div>
            <div class="modal-wrap" id="modal-wrap${item.id}">
                
                
                <div class="modal_contents">
                    <div style="font-size:20px;display:inline-block;">[${item.category}] ${item.place_name}</div>
                    <a href="#"><div class="modal_close" onClick="javascript:popClose(${item.id});">Close</div></a>
                    <hr>
                    
                    <img src="${item.place_img}" style='width:300px;height:180px;')>
                    <p style="font-size:15px;">주소 : ${item.place_address}</p>
                    <p style="font-size:15px;">전화번호 : ☎ ${item.place_number}</p>
                    <p style="font-size:15px;">영업시간 : ${item.place_time}</p>
                </div>
                    <div class="modal_map" id="map${item.id}">
                </div>
                
            </div>

            `
        )

        //지도 API
        var mapOptions = {
            center: new naver.maps.LatLng(`${item.latitude}`, `${item.longitude}`),
            zoom: 16
        }
        
        var contentString = 
        `<div class="iw_inner">
            [${item.category}]  ${item.place_name}<br>
            ${item.place_address}<br>
            ☎${item.place_number}<br>
        </div>`

        var map = new naver.maps.Map(`map${item.id}`, mapOptions);
        var marker = new naver.maps.Marker({
            title: "title",
            position: new naver.maps.LatLng(`${item.latitude}`, `${item.longitude}`),
            map: map,
            icon: {
                content: '<img src="./images/icon/map_marker.png" alt="" class="marker_style" style="-webkit-user-select: none;">',
                size: new naver.maps.Size(22, 35),
                anchor: new naver.maps.Point(11, 35)
            }
        });

        
        let infoWindows = new Array();
        // infowindow 내용
        var infowindow = new naver.maps.InfoWindow({
            content: contentString,
            backgroundColor: 'transparent',
            borderWidth: 0,
            disableAnchor: true,
            pixelOffset: new naver.maps.Point(0, -10),
        });

        
        infoWindows.push(infowindow)

        // infowindow 클릭
        naver.maps.Event.addListener(marker, "click", function(e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
        });
    })
}

function move_list_page(cate_id) {
    window.location.href = `/place_list.html?$id=${cate_id}/`
}

async function UserPlaceListView(cate_id, page) {
    const response = await fetch(`http://127.0.0.1:8000/places/list/${cate_id}/?page=${page}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            'Authorization': "Bearer " + localStorage.getItem("access")
        }
    })
    response_json = await response.json()

    console.log(response_json)
    // 페이지네이션
    const page_no2 = response_json.next.split('=')[1].split('/')[0]
    const last_page_no = parseInt(response_json.count/10)
    console.log(page_no2)
    if (page_no2-1 == 1) {
        console.log(page_no2-1)
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div class="current_page">${page_no2-1}</div></a>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${page_no2})">${page_no2}</div></a>
            <div>...</div>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    } else if (page_no2-1 == 2)  {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, 1)">1</div></a>
            <a href="#"><div class="current_page">${page_no2-1}</div></a>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${page_no2})">${page_no2}</div></a>
            <div>...</div>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else if (page_no2-1 == last_page_no) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, 1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${page_no2-2})">${page_no2-2}</div></a>
            <a href="#"><div class="current_page">${page_no2-1}</div></a>
            >
        `
    )
    } else if (page_no2-1 == last_page_no-1) {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="UserPlaceListView(${cate_id},1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="UserPlaceListView(${cate_id},${page_no2-2})">${page_no2-2}</div></a>
            <a href="#"><div class="current_page">${page_no2-1}</div></a>
            <a href="#"><div onclick="UserPlaceListView(${cate_id},${last_page_no})">${last_page_no}</div></a>
            >
        `)
    }else {
        $('#pagenation').empty()
        $('#pagenation').append(
        `
            <
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, 1)">1</div></a>
            <div>...</div>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${page_no2-2})">${page_no2-2}</div></a>
            <a href="#"><div class="current_page">${page_no2-1}</div></a>
            <a href="#"><div onclick="UserPlaceListView(${cate_id},${page_no2})">${page_no2}</div></a>
            <div>...</div>
            <a href="#"><div onclick="UserPlaceListView(${cate_id}, ${last_page_no})">${last_page_no}</div></a>
            >
        `
    )
    }


    //장소 추천 리스트
    $('#place-list').empty()
    response_json.results.forEach(item => {
        $('#place-list').append(
            `<table cellpadding="0" cellspacing="0" border="0">
            <td width="20%"><img src="${item.place_img}" style='width:70px;height:80px;')></td>
            <td width="70%">
                <a href="#" onclick="move_place_detail_page(${item.id})"><div style="font-size:15px;">[${item.category}] ${item.place_name}</div></a>
                <div>${item.place_address}</div>
                <div>☎${item.place_number}</div>
                <div>${item.place_time}</div>
                <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">지도보기</div></a>
                <a href="#" onclick="move_place_detail_page(${item.id})"><div class="market_detail_button">상세보기</div></a>
            </td>
            <td width="10%">${item.rating}</td>
        </table>
        
        <div class="modal-bg" id="modal-bg${item.id}"onClick="javascript:popClose(${item.id});"></div>
        <div class="modal-wrap" id="modal-wrap${item.id}">
            
            
            <div class="modal_contents">
                <div style="font-size:20px;display:inline-block;">[${item.category}] ${item.place_name}</div>
                <a href="#"><div class="modal_close" onClick="javascript:popClose(${item.id});">Close</div></a>
                <hr>
                
                <img src="${item.place_img}" style='width:300px;height:180px;')>
                <p style="font-size:15px;">주소 : ${item.place_address}</p>
                <p style="font-size:15px;">전화번호 : ☎ ${item.place_number}</p>
                <p style="font-size:15px;">영업시간 : ${item.place_time}</p>
            </div>
                <div class="modal_map" id="map${item.id}">
            </div>
            
        </div>
                
            `
        )
        //지도 API
        var mapOptions = {
            center: new naver.maps.LatLng(`${item.latitude}`, `${item.longitude}`),
            zoom: 16
        }
        
        var contentString = 
        `<div class="iw_inner">
            [${item.category}]  ${item.place_name}<br>
            ${item.place_address}<br>
            ☎${item.place_number}<br>
        </div>`

        var map = new naver.maps.Map(`map${item.id}`, mapOptions);
        var marker = new naver.maps.Marker({
            title: "title",
            position: new naver.maps.LatLng(`${item.latitude}`, `${item.longitude}`),
            map: map,
            icon: {
                content: '<img src="./images/icon/map_marker.png" alt="" class="marker_style" style="-webkit-user-select: none;">',
                size: new naver.maps.Size(22, 35),
                anchor: new naver.maps.Point(11, 35)
            }
        });

        
        let infoWindows = new Array();
        // infowindow 내용
        var infowindow = new naver.maps.InfoWindow({
            content: contentString,
            backgroundColor: 'transparent',
            borderWidth: 0,
            disableAnchor: true,
            pixelOffset: new naver.maps.Point(0, -10),
        });

        
        infoWindows.push(infowindow)

        // infowindow 클릭
        naver.maps.Event.addListener(marker, "click", function(e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
        });
    })
}


function move_place_detail_page(place_id){
    window.location.href = `/place_detail.html?id=${place_id}`

}