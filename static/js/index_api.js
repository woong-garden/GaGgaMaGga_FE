
if (localStorage.getItem("kakao")){
} else if (location.href.split('=')[1]){
    const kakao_code = location.href.split('=')[1]
    kakaoLoginApi(kakao_code)
}

if(localStorage.getItem("payload")){
    if (JSON.parse(localStorage.getItem("payload")).password_expired == true){
        expired_password_confirm()
    }
}
window.onload = function(){
    IsUserOrNot()
}

function sendSearchKeyword(){
    var inputValue = document.getElementById('search').value;
    window.location.href = `/search.html?search=${inputValue}`
}

function enterkey(e) {
    if (window.event.keyCode == 13){
        sendSearchKeyword().then();
    }
}

//카카오 로그인 back으로 전달
async function kakaoLoginApi(kakao_code) {
    const response = await fetch(`${backendBaseUrl}/users/kakao/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"code":kakao_code}),
    })
    response_json = await response.json()

    if (response.status === 200) {
        localStorage.setItem("access", response_json.access); 
        localStorage.setItem("refresh", response_json.refresh);
        localStorage.setItem('nickname', response_json.nickname);
        localStorage.setItem('review_cnt', response_json.review_cnt);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );
        localStorage.setItem("kakao", jsonPayload);
    }else {
        alert(response_json['error'])
        window.history.back()
}}

//유저 비밀번호 만료 확인
async function expired_password_confirm() {

    const response = await fetch(`${backendBaseUrl}/users/password-expired-change/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    })

    const result = await response.json()

    if (response.status === 200) {
        alert(result['message'])
        location.replace('expired_password.html')
    } 
}


function move_rcm_list_page(cate_id){
    window.location.href = `/place_list.html?$cate_id=${cate_id}/`
}

function move_select_page(cate_id){ 
    window.location.href = `/place_preference.html?$id=${cate_id}/`
}




async function IsUserOrNot(){
    const storage = localStorage.getItem("payload");
    const kakao = localStorage.getItem("kakao");
    if (storage !== null) {
        const str_payload = JSON.parse(storage)
        if (str_payload.review_cnt != 0) {
            $('#index-selectbox').empty()
            $('#index-selectbox').append(
                `<section class="select-place-wrap">
                <div>
                    <div>
                        <div>음식으로 선택하기</div>
                    </div>
                    <div>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(3)">
                            <img class="index_img" src="./images/icon/foods/Korean.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(6)">
                            <img class="index_img" src="./images/icon/foods/fastfoods.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(7)">
                            <img class="index_img" src="./images/icon/foods/Chinese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(8)">
                            <img class="index_img" src="./images/icon/foods/Japanese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(9)">
                            <img class="index_img" src="./images/icon/foods/Western.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(12)">
                        <img class="index_img" src="./images/icon/foods/Asian.png">
                        </div></a>
                    </div>
                </div>
                <div>
                    <div>
                        <div>장소로 선택하기</div>
                    </div>
                    <div>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(13)">
                        <img class="index_img" src="./images/icon/foods/jeju.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(14)">
                        <img class="index_img" src="./images/icon/foods/sgp.png">
                        </div></a>
                    </div>
                </div>
            </section>`)
        } else {
            $('#index-selectbox').empty()
            $('#index-selectbox').append(
                `<section class="select-place-wrap">
                <div>
                    <div>
                        <div>음식으로 검색하기</div>
                    </div>
                    <div>
                    <a href="#"><div class="select_box2" onclick="move_select_page(3)">
                    <img class="index_img" src="./images/icon/foods/Korean.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(6)">
                            <img class="index_img" src="./images/icon/foods/fastfoods.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(7)">
                            <img class="index_img" src="./images/icon/foods/Chinese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(8)">
                            <img class="index_img" src="./images/icon/foods/Japanese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(9)">
                            <img class="index_img" src="./images/icon/foods/Western.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(12)">
                        <img class="index_img" src="./images/icon/foods/Asian.png">
                        </div></a>
                    </div>
                </div>
                <div>
                    <div>
                        <div>장소로 선택하기</div>
                    </div>
                    <div>
                        <a href="#"><div class="select_box2" onclick="move_select_page(13)">
                        <img class="index_img" src="./images/icon/foods/jeju.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(14)">
                        <img class="index_img" src="./images/icon/foods/sgp.png">
                        </div></a>
                    </div>
                </div>
            </section>`
            )
        }
    }else if(kakao !== null){
        const rev_cnt = localStorage.getItem("review_cnt");
        if (rev_cnt != 0) {
            $('#index-selectbox').empty()
            $('#index-selectbox').append(
                `<section class="select-place-wrap">
                <div>
                    <div>
                        <div>음식으로 선택하기</div>
                    </div>
                    <div>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(3)">
                            <img class="index_img" src="./images/icon/foods/Korean.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(6)">
                            <img class="index_img" src="./images/icon/foods/fastfoods.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(7)">
                            <img class="index_img" src="./images/icon/foods/Chinese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(8)">
                            <img class="index_img" src="./images/icon/foods/Japanese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(9)">
                            <img class="index_img" src="./images/icon/foods/Western.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(12)">
                        <img class="index_img" src="./images/icon/foods/Asian.png">
                        </div></a>
                    </div>
                </div>
                <div>
                    <div>
                        <div>장소로 선택하기</div>
                    </div>
                    <div>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(13)">
                        <img class="index_img" src="./images/icon/foods/jeju.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_rcm_list_page(14)">
                        <img class="index_img" src="./images/icon/foods/sgp.png">
                        </div></a>
                    </div>
                </div>
            </section>`)
        } else {
            $('#index-selectbox').empty()
            $('#index-selectbox').append(
                `<section class="select-place-wrap">
                <div>
                    <div>
                        <div>음식으로 검색하기</div>
                    </div>
                    <div>
                    <a href="#"><div class="select_box2" onclick="move_select_page(3)">
                    <img class="index_img" src="./images/icon/foods/Korean.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(6)">
                            <img class="index_img" src="./images/icon/foods/fastfoods.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(7)">
                            <img class="index_img" src="./images/icon/foods/Chinese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(8)">
                            <img class="index_img" src="./images/icon/foods/Japanese.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(9)">
                            <img class="index_img" src="./images/icon/foods/Western.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(12)">
                        <img class="index_img" src="./images/icon/foods/Asian.png">
                        </div></a>
                    </div>
                </div>
                <div>
                    <div>
                        <div>장소로 선택하기</div>
                    </div>
                    <div>
                        <a href="#"><div class="select_box2" onclick="move_select_page(13)">
                        <img class="index_img" src="./images/icon/foods/jeju.png">
                        </div></a>
                        <a href="#"><div class="select_box2" onclick="move_select_page(14)">
                        <img class="index_img" src="./images/icon/foods/sgp.png">
                        </div></a>
                    </div>
                </div>
            </section>`
            )
        }
    }else{
        $('#index-selectbox').empty()
        $('#index-selectbox').append(
            `<section class="select-place-wrap">
            <div>
                <div>
                    <div>음식으로 검색하기</div>
                </div>
                <div>
                <a href="#"><div class="select_box2" onclick="move_select_page(3)">
                <img class="index_img" src="./images/icon/foods/Korean.png">
            </div></a>
            <a href="#"><div class="select_box2" onclick="move_select_page(6)">
                <img class="index_img" src="./images/icon/foods/fastfoods.png">
            </div></a>
            <a href="#"><div class="select_box2" onclick="move_select_page(7)">
                <img class="index_img" src="./images/icon/foods/Chinese.png">
            </div></a>
            <a href="#"><div class="select_box2" onclick="move_select_page(8)">
                <img class="index_img" src="./images/icon/foods/Japanese.png">
            </div></a>
            <a href="#"><div class="select_box2" onclick="move_select_page(9)">
                <img class="index_img" src="./images/icon/foods/Western.png">
            </div></a>
            <a href="#"><div class="select_box2" onclick="move_select_page(12)">
            <img class="index_img" src="./images/icon/foods/Asian.png">
            </div></a>
                </div>
            </div>
            <div>
                <div>
                    <div>장소로 선택하기</div>
                </div>
                <div>
                    <a href="#"><div class="select_box2" onclick="move_select_page(13)">
                    <img class="index_img" src="./images/icon/foods/jeju.png">
                    </div></a>
                    <a href="#"><div class="select_box2" onclick="move_select_page(14)">
                    <img class="index_img" src="./images/icon/foods/sgp.png">
                    </div></a>
                </div>
            </div>
        </section>`
        )
    }
}

function move_list_page(cate_id){
    window.location.href = `/place_list.html?$cate_id=${cate_id}/`
}

function move_select_page(cate_id){ 
    window.location.href = `/place_preference.html?$id=${cate_id}/`
}