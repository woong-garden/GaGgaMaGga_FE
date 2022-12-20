
window.onload = function(){
    const cate_id = location.href.split('=')[1].split('/')[0]
    PlaceSelectView(cate_id)
    }

    

    function reload_page(){
        location.reload(true);
    }



//select
async function PlaceSelectView(choice_no){
    const response = await fetch(`${backendBaseUrl}/places/selection/${choice_no}/`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
        }
    })
    response_json = await response.json()
    if (choice_no > 12) {
        $('#select-box').empty()
        $("select_button_reload").empty()
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
        $("select_button_reload").empty()
        response_json.forEach(item => {
            $("select_button_reload").append(
                `<div class="select_button" onclick="reload_page()"><a href="#" style="text-decoration:none;color:#000;">다시 검색하기</a></div>`
            )
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

