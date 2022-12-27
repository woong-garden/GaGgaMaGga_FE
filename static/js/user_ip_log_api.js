if(localStorage.getItem("access")){} 
else{
    alert("접근이 불가능합니다.")
    window.location.replace("index.html")
}
    login_log() 
function time2str(date) {
    let date_time = new Date(date)

    return `${date_time.getFullYear()}년 ${date_time.getMonth() + 1}월 ${date_time.getDate()}일 ${date_time.getHours()}시 ${date_time.getMinutes()}분`
};


async function login_log(){
    const response = await fetch(`${backendBaseUrl}/users/logs/`, {
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
                        <h6 style="font-size:15px">접속 지역: ${item.country}</h6></h6> 
                        <h6 style="font-size:15px">접속 ip: ${item.updated_ip}</h6></h6> 
                        <h6 style="font-size:15px">접속 시간: ${time_format}</h6></h6>
                    </div>
                </div>
            </div>
        </div>
            `
        )
    })
}