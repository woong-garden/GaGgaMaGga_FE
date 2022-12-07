
window.onload = function(){
    console.log("연결완료")
    const place_id = location.href.split('=')[1].split('&')[0]
    const category = location.href.split('=')[2].split('/')[0]
    NewUserPlaceListView(place_id, category)
    }


//select
async function NewUserPlaceListView(place_id, category){
    const response = await fetch(`http://127.0.0.1:8000/places/new/${place_id}/${category}/`, {
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
            `
            <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>
                            <td width="20%"><img src="${item.place_img}" style='width:70px;height:80px;')></td>
                            <td width="70%">
                                <div style="font-size:15px;">${item.place_name}</div>
                                <div>${item.place_address}  ☎${item.place_number}</div>
                                <div></div>
                                <div>${item.place_time}</div>
                            </td>
                            <td width="10%">${item.rating}</td>
                        </tr>
                    </tbody>
                </table>
            `
        )
    });
}

function move_list_page(cate_id){ 
    window.location.href = `/place_list.html?$id=${cate_id}/`
}