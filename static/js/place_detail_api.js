window.onload = () => {
    console.log('안녕')
}

async function PlaceDetail(){
    const response = await fetch(`http://127.0.0.1:8000/places/7/`,{
        method:'GET',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            }
        }
    )
    response_json = await response.json()
    
    response_json.forEach(item => {
        $('#menu-list').append(
            `
            <div class="menu-list-box">
                <div class="menu-list-content">
                    <div class="menu-list-content-title">
                        ${item.menu}
                    </div>
                    <div>
                        79900원
                    </div>
                </div>
                    <img class="menu-list-content-img" src="https://ldb-phinf.pstatic.net/20221114_210/1668435518684QReuq_JPEG/%B3%D7%C0%CC%B9%F6%C7%C3%B7%B9%C0%CC%BD%BA_%C4%DA%BE%EE_1%281200x970%29.jpg">
            </div>
            `
        )
    })
}
PlaceDetail()