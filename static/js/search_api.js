function sendSearchKeyword(){
    var inputValue = document.getElementById('search').value;
    window.location.href = `/search.html?search=${inputValue}`
}


async function searchParam(){
    let getLink = window.location.search;
    let getLink_Name = getLink.split('=');
    let getLink_result = getLink_Name[1];
    let decodeResult = decodeURI(getLink_result);
    console.log(decodeResult)

    if(decodeResult){
        const response = await fetch(`http://127.0.0.1:8000/places/search/?q=${decodeResult}`,{
            headers:{
                'content-type':'application/json'
            },
            method:'GET',
        })
        response_json = await response.json()

        if(response_json.hits.length){
            response_json.hits.forEach(item => {
                console.log(response_json.hits)
                $('#search-list').append(
                    `
                    <div class="review-list">
                        <a class="place-item">
                            <div>
                                <div style="width:100px;height:100px;">
                                    <img style="width:100%;height:100%;" src="${item.place_img}">
                                </div>
                            </div>
                            <div class="place-item-content-box">
                                <div>${item.place_name}</div>
                                <div class="place-item-content">
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste commodi nisi aliquam, aliquid est illo quaerat maxime aspernatur eveniet beatae molestias nam exercitationem ut incidunt unde libero placeat sapiente! Quisquam!
                                </div>
                                <div class="rating">
                                    <img src="/images/icon/star.svg" alt="">
                                    <div>${item.rating}</div>
                                </div>
                            </div>
                        </a>
                        <div>
                            <button class="btn-bookmark">북마크</button>
                        </div>
                    </div>
                    `
                )
            });
        }else{
            alert(`${decodeResult} 검색내용이 없습니다!`);
        }
    }else{
        alert(`검색내용을 입력해주세요!`);
    }
}


function enterkey(e) {
    if (window.event.keyCode == 13){
        sendSearchKeyword().then();
    }
}


function move_detail_page(click_id){ 
    console.log(click_id)

}