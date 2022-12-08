if(localStorage.getItem("access")){
    login_log()
} else{
    alert("접근이 불가능합니다.")
    location.replace("index.html")
}

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
        $('#my-review').append(
            `
            <div class="card">
            <div class="row">
                <div class="col-md-6" style="flex-basis:66.6666666%; max-width: 100%;">
                    <div class="card-body">
                        <h6 style="font-size:15px">접속 ip: ${item.update_ip}</h6></h6> 
                        <h6 style="font-size:15px">접속 시간: ${item.created_at}</h6></h6>
                    </div>
                </div>
            </div>
        </div>
            `
        )
    })
}
