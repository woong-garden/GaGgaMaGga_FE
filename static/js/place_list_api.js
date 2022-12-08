
window.onload = function () {
    console.log("연결완료")
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
    var modalPop = $('#modal-wrap'+String(id));
    var modalBg = $('#modal-bg'+String(id));
    $(modalPop).show();
    $(modalBg).show();
}

function popClose(id) {
    var modalPop = $('#modal-wrap'+String(id));
    var modalBg = $('#modal-bg'+String(id));
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
                    <a href="#" class="btn-open" onClick="javascript:popOpen(${item.id});"><div class="market_detail_button btn-box">상세보기</div></a>
                    <a href="#"><div class="market_detail_button">리뷰쓰기</div></a>
                </td>
                <td width="10%">${item.rating}</td>
            </table>
            
            <div class="modal-bg" id="modal-bg${item.id}"onClick="javascript:popClose(${item.id});"></div>
            <div class="modal-wrap" id="modal-wrap${item.id}">
                <div style="font-size:15px;">[${item.category}] ${item.place_name}</div>
                <button class="modal-close" onClick="javascript:popClose(${item.id});">닫기</button>
            </div>
            `
        )

    });
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
            `<div class="modal">
                <div class="modal_body">Modal</div>
            </div>
            <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>
                            <td width="20%"><img src="${item.place_img}" style='width:70px;height:80px;')></td>
                            <td width="70%">
                                <div style="font-size:15px;">[${item.category}] ${item.place_name}</div>
                                <div>${item.place_address}  ☎${item.place_number}</div>
                                <div></div>
                                <div>${item.place_time}</div>
                                <a href="#" class="btn-open" onClick="javascript:popOpen();"><div class="market_detail_button btn-box">상세보기</div></a>
                                <a href="#"><div class="market_detail_button">리뷰쓰기</div></a>
                            </td>
                            <td width="10%">${item.rating}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="modal-bg" onClick="javascript:popClose();"></div>
                <div class="modal-wrap">
                    <div style="font-size:15px;">[${item.category}] ${item.place_name}</div>
                    <button class="modal-close" onClick="javascript:popClose();">닫기</button>
                </div>
                
            `
        )
    });
}


