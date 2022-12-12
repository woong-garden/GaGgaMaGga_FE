
confirm_email()
async function confirm_email(){
    const secured_key= location.href.split('=')[1]
    if (secured_key){
    const response = await fetch(`${backendBaseUrl}/users/email-confirm?secured_key=${secured_key}`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                }
            }
        )
    response_json = await response.json()

    if (response.status === 200) {
        alert(response_json['message'])
        window.location.replace('login.html')

    } else if (response.status === 400) {
        alert(response_json['message'])
        window.location.replace('index.html')
    }
} else{
    alert("접근이 불가합니다.")
    window.location.replace('index.html')}
}