
window.onload = function () {
    const storage = localStorage.getItem("payload");
    if (storage) {
        const cate_id = location.href.split('=')[1].split('/')[0]
        UserPlaceListView(cate_id)
    } else {
        const place_id = location.href.split('=')[1].split('&')[0]
        const category = location.href.split('=')[2].split('/')[0]
        NewUserPlaceListView(place_id, category)
    }
}


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
async function NewUserPlaceListView(place_id, category) {
    const response = await fetch(`http://127.0.0.1:8000/places/new/${place_id}/${category}/`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
        }
    })
    response_json = await response.json()
    $('#place-list').empty()
    response_json.forEach(item => {
        $('#place-list').append(
            `
            <table cellpadding="0" cellspacing="0" border="0">
                <td width="20%"><img src="${item.place_img}" style='width:70px;height:80px;')></td>
                <td width="70%">
                    <div style="font-size:15px;">[${item.category}] ${item.place_name}</div>
                    <div>${item.place_address}  ☎${item.place_number}</div>
                    <div></div>
                    <div>${item.place_time}</div>
                    <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">지도보기</div></a>
                    <a href="#"><div class="market_detail_button">상세보기</div></a>
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


async function UserPlaceListView(cate_id) {
    const response = await fetch(`http://127.0.0.1:8000/places/${cate_id}/`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            'Authorization': "Bearer " + localStorage.getItem("access")
        }
    })
    response_json = await response.json()

    $('#place-list').empty()
    response_json.forEach(item => {
        $('#place-list').append(
            `<table cellpadding="0" cellspacing="0" border="0">
            <td width="20%"><img src="${item.place_img}" style='width:70px;height:80px;')></td>
            <td width="70%">
                <div style="font-size:15px;">[${item.category}] ${item.place_name}</div>
                <div>${item.place_address}  ☎${item.place_number}</div>
                <div></div>
                <div>${item.place_time}</div>
                <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">지도보기</div></a>
                <a href="#"><div class="market_detail_button">상세보기</div></a>
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


