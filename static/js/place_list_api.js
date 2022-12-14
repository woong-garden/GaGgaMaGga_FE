
window.onload = function () {
    const storage = localStorage.getItem("payload");
    const kakao = localStorage.getItem("kakao");
    if (storage !== null) {
        const str_payload = JSON.parse(storage)
        if (str_payload.review_cnt != 0) {
            const cate_id = location.href.split('=')[1].split('/')[0]
            UserPlaceListView(cate_id, 1)
        } else {
            const place_id = location.href.split('=')[1].split('&')[0]
            const category = location.href.split('=')[2].split('/')[0]
            NewUserPlaceListView(place_id, category, 1)
        }
    }else if(kakao !== null){
        const rev_cnt = localStorage.getItem("review_cnt");
        console.log(rev_cnt)
        if (rev_cnt != 0) {
            const cate_id = location.href.split('=')[1].split('/')[0]
            UserPlaceListView(cate_id, 1)
        } else {
            const place_id = location.href.split('=')[1].split('&')[0]
            const category = location.href.split('=')[2].split('/')[0]
            NewUserPlaceListView(place_id, category, 1)
        }
    } else {
        const place_id = location.href.split('=')[1].split('&')[0]
        const category = location.href.split('=')[2].split('/')[0]
        NewUserPlaceListView(place_id, category, 1)
    }
}


var _showPage = function() {
    var loader = $("div.loader");
    var container = $("div.tbl-content");
    loader.css("display","none");
    container.css("display","block");
};



//delete_button
function ActiveDeleteButton(id) {
    document.getElementById(`delete_place${id}`).style.display ="inline-block"
}

// 지도 modal
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

// 삭제버튼 modal
function DltPopOpen(id) {
    var modalPop = $('#dlt-modal-wrap' + String(id));
    var modalBg = $('#dlt-modal-bg' + String(id));
    $(modalPop).show();
    $(modalBg).show();
}
function DltPopClose(id) {
    var modalPop = $('#dlt-modal-wrap' + String(id));
    var modalBg = $('#dlt-modal-bg' + String(id));
    $(modalPop).hide();
    $(modalBg).hide();
}



//select
async function NewUserPlaceListView(place_id, category, page) {
    const response = await fetch(`${backendBaseUrl}/places/new/${place_id}/${category}/?page=${page}`, {    
        method: 'GET',
        headers: {
            "Content-type": "application/json",
        }
    })
    response_json = await response.json()
    console.log(response_json)
    const storage = localStorage.getItem("payload");
    const str_payload = JSON.parse(storage)

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
                <td width="20%"><img src="${item.place_img}" class="place-item-img")></td>
                <td width="70%">
                <a href="#" onclick="move_place_detail_page(${item.id})" style="text-decoration:none; color:#000"><div style="font-size:15px;font-weight:bold;">[${item.category}] ${item.place_name}</div></a>
                    <div>${item.place_address}</div>
                    <div style="display:inline-block;">☎${item.place_number}</div>
                    <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">지도보기</div></a>
                    <a href="#" class="btn-open" onClick="javascript:DltPopOpen(${item.id});"><div class="market_detail_button btn-box" id="delete_place${item.id}" style="display:none;">장소삭제</div>
                    </td>
                <td class="item-rating" width="10%">${item.rating}</td>
            </table>
            
            <div class="modal-bg" id="modal-bg${item.id}"onClick="javascript:popClose(${item.id});"></div>
            <div class="modal-wrap" id="modal-wrap${item.id}">
                <div class="modal_contents">
                    <div style="display:flex;justify-content: space-between; align-items:center;">
                        <div style="font-size:20px;display:inline-block;">
                            [${item.category}] ${item.place_name}
                        </div>
                        <a href="#">
                            <div class="modal_close" onClick="javascript:popClose(${item.id});">
                                Close
                            </div>
                        </a>
                    </div>
                    <hr>
                    
                    <img src="${item.place_img}" style='width:300px;height:180px;')>
                    <p style="font-size:15px;">주소 : ${item.place_address}</p>
                    <p style="font-size:15px;">전화번호 : ☎ ${item.place_number}</p>
                    <p style="font-size:15px;">영업시간 : ${item.place_time}</p>
                </div>
                    <div class="modal_map" id="map${item.id}">
                </div>
            </div>

            <div class="dlt-modal-bg" id="dlt-modal-bg${item.id}"onClick="javascript:DltPopClose(${item.id});"></div>
            <div class="dlt-modal-wrap" id="dlt-modal-wrap${item.id}">
                <div class="dlt_modal_contents">
                    <p style="font-size:25px;">정말 삭제하시겠습니까?</p>
                    <div style="font-size:20px;display:inline-block;">[${item.category}] ${item.place_name}</div>
                    <hr>
                    <img src="${item.place_img}" style='width:300px;height:180px;')>
                    <div style="text-align:center;">
                        <a href="#"><div class="modal_close" onClick="DeletePlaceView(${item.id})">Delete</div></a>
                        <a href="#"><div class="modal_close" onClick="javascript:DltPopClose(${item.id});">Close</div></a>
                    </div>

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
    _showPage()
}

function move_list_page(cate_id) {
    window.location.href = `/place_list.html?$id=${cate_id}/`
}

async function UserPlaceListView(cate_id, page) {
    const response = await fetch(`${backendBaseUrl}/places/list/${cate_id}/?page=${page}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            'Authorization': "Bearer " + localStorage.getItem("access")
        }
    })
    response_json = await response.json()
    const storage = localStorage.getItem("payload");
    const str_payload = JSON.parse(storage)

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
            <td width="20%"><img class="place-item-img" src="${item.place_img}")></td>
            <td width="70%">
                <a href="#" onclick="move_place_detail_page(${item.id})" style="text-decoration:none; color:#000"><div style="font-size:15px;font-weight:bold;">[${item.category}] ${item.place_name}</div></a>
                <div>${item.place_address}</div>
                <div style="display:inline-block;">☎${item.place_number}</div>
                <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">지도보기</div></a>
                <a href="#" class="btn-open" onClick="javascript:DltPopOpen(${item.id});"><div class="market_detail_button btn-box" id="delete_place${item.id}" style="display:none;">장소삭제</div>
            <td class="item-rating" width="10%">${item.rating}</td>
        </table>
        
        <div class="modal-bg" id="modal-bg${item.id}"onClick="javascript:popClose(${item.id});"></div>
        <div class="modal-wrap" id="modal-wrap${item.id}">
            <div class="modal_contents">
                    <div style="font-size:20px;display:inline-block;">[${item.category}] ${item.place_name}</div>
                    <a href="#">
                        <div class="modal_close" onClick="javascript:popClose(${item.id});">
                            Close
                    </a>
                </div>
                <hr>
                <img src="${item.place_img}" style='width:300px;height:180px;')>
                <p style="font-size:15px;">주소 : ${item.place_address}</p>
                <p style="font-size:15px;">전화번호 : ☎ ${item.place_number}</p>
                <p style="font-size:15px;">영업시간 : ${item.place_time}</p>
            </div>
                <div class="modal_map" id="map${item.id}">
            </div>
        </div>

        <div class="dlt-modal-bg" id="dlt-modal-bg${item.id}"onClick="javascript:DltPopClose(${item.id});"></div>
        <div class="dlt-modal-wrap" id="dlt-modal-wrap${item.id}">
            <div class="dlt_modal_contents">
                <div style="font-size:20px;display:inline-block;">[${item.category}] ${item.place_name}</div>
                <a href="#"><div class="modal_close" onClick="javascript:popClose(${item.id});">Close</div></a>
                <hr>
                <img src="${item.place_img}" style='width:300px;height:180px;')>
                <p style="font-size:15px;">정말 해당 장소를 삭제하시겠습니까?</p>

            </div>
                <div class="modal_map" id="map${item.id}">
            </div>
        </div>
                
            `
        )

        // 장소 삭제 버튼 생성
        if (storage !== null) {
            if (str_payload.is_admin) {
                ActiveDeleteButton(`${item.id}`)
            }
        }
        
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
    _showPage()
}


function move_place_detail_page(place_id){
    window.location.href = `/place_detail.html?id=${place_id}`
}

async function DeletePlaceView(place_id) {
    const response = await fetch(`${backendBaseUrl}/places/${place_id}/`, {
        method: 'DELETE',
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
    })
    location.reload(true);
}


