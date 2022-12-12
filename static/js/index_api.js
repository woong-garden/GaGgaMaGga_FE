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

//카카오 로그인 back으로 전달
async function kakaoLoginApi(kakao_code) {
    const response = await fetch(`http://127.0.0.1:8000/users/kakao/`, {
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



async function IsUserOrNot(){
    const storage = localStorage.getItem("payload");
    if (storage) {
        console.log("[로그인 계정] 데이터 로드 완료")
        $('#index-selectbox').empty()
        $('#index-selectbox').append(
            `<section class="select-place-wrap">
            <div>
                <div>
                    <div>음식으로 선택하기</div>
                </div>
                <div>
                    <a href="#"><div class="select_box2" onclick="move_list_page(3)">
                        <img class="index_img" src="./images/icon/foods/Korean.png">
                    </div></a>
                    <a href="#"><div class="select_box2" onclick="move_list_page(6)">
                        <img class="index_img" src="./images/icon/foods/fastfoods.png">
                    </div></a>
                    <a href="#"><div class="select_box2" onclick="move_list_page(7)">
                        <img class="index_img" src="./images/icon/foods/Chinese.png">
                    </div></a>
                    <a href="#"><div class="select_box2" onclick="move_list_page(8)">
                        <img class="index_img" src="./images/icon/foods/Japanese.png">
                    </div></a>
                    <a href="#"><div class="select_box2" onclick="move_list_page(9)">
                        <img class="index_img" src="./images/icon/foods/Western.png">
                    </div></a>
                    <a href="#"><div class="select_box2" onclick="move_list_page(12)">
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
        </section>`)
    }else{
        console.log("[비로그인 계정] 데이터 로드 완료")
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

