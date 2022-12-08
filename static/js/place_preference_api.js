
window.onload = function(){
    console.log("연결완료")
    const cate_id = location.href.split('=')[1].split('/')[0]
    PlaceSelectView(cate_id)
    }


//select
async function PlaceSelectView(choice_no){
    const response = await fetch(`http://127.0.0.1:8000/places/selection/${choice_no}/`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            'Authorization': "Bearer " + localStorage.getItem("access")
        }
    })
    response_json = await response.json()
    if (choice_no > 12) {
        $('#select-box').empty()
        response_json.forEach(item => {
            $('#select-box').append(
                `
                <button class="select_box" style="background-image:url(${item.place_img});" onclick=move_list_page("${item.category}",${item.id})>
                    <p class="p_name">${item.category}</p>
                </button>
                `
            )
        });
    } else {
        $('#select-box').empty()
        response_json.forEach(item => {
            $('#select-box').append(
                `
                <button class="select_box" style="background-image:url(${item.place_img});" onclick=move_list_page("${item.category}",${item.id})>
                    <p class="p_name">${item.place_name}</p>
                </button>
                `
            )
        });
    }
}

function move_list_page(category, place_id){ 
    window.location.href = `/place_list.html?$place=${place_id}&cate=${category}/`
}