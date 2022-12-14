



function sendSearchKeyword(){
    var inputValue = document.getElementById('search').value;
    window.location.href = `/search.html?search=${inputValue}`
}

async function searchParam(){
    const getLink = window.location.search;
    const getLink_Name = getLink.split('=');
    const getLink_result = getLink_Name[1];
    const decodeResult = decodeURI(getLink_result);

    if(decodeResult){
        const response = await fetch(`${backendBaseUrl}/places/search/?keyword=${decodeResult}`,{
            headers:{
                'content-type':'application/json'
            },
            method:'GET',
        })
        response_json = await response.json()
        
        const place_list_count = document.getElementById("place_list_count")
        place_list_count.innerText = `검색결과 (${response_json.hits.length})`
        
        console.log(response_json.hits.place_img)

            if(response_json.hits.length){
                response_json.hits.forEach(item => {
                    if(item.place_img==null){
                        $('#search-list').append(
                            `
                            <div class="review-list">
                                <a onclick="move_place_detail_page(${item.objectID})" class="place-item">
                                    <div>
                                        <div style="width:100px;height:100px;">
                                            <img style="width:100%;height:100%;" src='https://www.anyang.go.kr/DATA/board/2018/6/30/4d583737-fac7-4b97-a481-a4ade1a3fe8e.jpg'>
                                        </div>
                                    </div>
                                    <div class="place-item-content-box">
                                        <div>${item.place_name}</div>
                                        <div class="place-item-content">
                                            ${item.place_address}
                                        </div>
                                        <div class="rating">
                                            <img src="/images/icon/star.svg" alt="">
                                            <div>${item.rating}</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            `
                        )
                    }else{
                    $('#search-list').append(
                        `
                        <div class="review-list">
                            <a onclick="move_place_detail_page(${item.objectID})" class="place-item">
                                <div>
                                    <div style="width:100px;height:100px;">
                                        <img style="width:100%;height:100%;" src='${item.place_img}'>
                                    </div>
                                </div>
                                <div class="place-item-content-box">
                                    <div>${item.place_name}</div>
                                    <div class="place-item-content">
                                        ${item.place_address}
                                    </div>
                                    <div class="rating">
                                        <img src="/images/icon/star.svg" alt="">
                                        <div>${item.rating}</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        `
                    )
                }
                });
            }else if (decodeResult === `undefined`){
                const search_content = document.getElementById('search-list')
                search_content.innerText = `검색내용을 입력해주세요`
            } else {
            const search_content = document.getElementById('search-list')
            search_content.innerText = `${decodeResult} 검색내용이 없습니다.`
            } 
}}
searchParam()


function enterkey(e) {
    if (window.event.keyCode == 13){
        sendSearchKeyword().then();
    }
}


function move_place_detail_page(place_id){ 
    window.location.href = `/place_detail.html?id=${place_id}`
}