if(localStorage.getItem("access")){} 
else{
    alert("접근이 불가능합니다.")
    window.location.replace("index.html")
}
ip_block_log() 

function time2str(date) {
    let date_time = new Date(date)

    return `${date_time.getFullYear()}년 ${date_time.getMonth() + 1}월 ${date_time.getDate()}일 ${date_time.getHours()}시 ${date_time.getMinutes()}분`
};


async function ip_block_log(){
    const response = await fetch(`${backendBaseUrl}/users/county-ip-block/`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()

    response_json.forEach(item => {
        const time_format = time2str(item.created_at)
        $('#my-review').append(
            `
            <div class="card" style="margin-bottom:12px">
            <div class="row">
                <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                    <div class="card-body">
                        <h6 style="font-size:15px">차단한 국가 코드: ${item.country}</h6>
                        <h6 style="font-size:15px">차단한 시간: ${time_format}</h6>
                        <button id=${item.id} onclick="ip_block_delete(this)" class="button login">삭제하기</button>
                    </div>
                </div>
            </div>
        </div>
            `
        )
    })
}

async function ip_block() {
    var delConfirm = confirm("해당 국가 코드를 차단하시겠습니까?")
    if (delConfirm){
    const country_select = document.getElementById("country-select")
    const counyty_select_value = (country_select.options[country_select.selectedIndex].value)  

    const response = await fetch(`${backendBaseUrl}/users/county-ip-block/`, {
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
        body: JSON.stringify({"country":counyty_select_value})
    })

    const result = await response.json()

    if (response.status === 201) {
        window.location.reload()

    } else if (response.status === 400) {
        alert(result["country"])
    }
}}

async function ip_block_delete(item) {
    var delConfirm = confirm("해당 국가 코드를 삭제하시겠습니까?")
    if (delConfirm){
    const response = await fetch(`${backendBaseUrl}/users/county-ip-block/${item.id}`, {
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'DELETE',
    })

    const result = await response.json()
    
    if (response.status === 200) {
        alert(result["message"])
        window.location.reload()
}}}