const place_id = location.href.split('?')[1].split('&')[0].split('=')[1]
const review_id = location.href.split('?')[1].split('&')[1].split('=')[1]

window.onload = () => {
    getData(place_id, review_id)

    const realUpload = document.querySelector('.real-upload');
    const upload = document.querySelector('.upload');

    upload.addEventListener('click', () => realUpload.click());

    function readMultipleImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader()

            reader.onload = e => {
                const firstPreview = document.querySelector('.first-img')
                firstPreview.src = e.target.result
            }
            reader.readAsDataURL(input.files[0])
        }
        if (input.files && input.files[1]) {
            const reader = new FileReader()

            reader.onload = e => {
                const secondPreview = document.querySelector('.second-img')
                secondPreview.src = e.target.result
            }
            reader.readAsDataURL(input.files[1])
        }
        if (input.files && input.files[2]) {
            const reader = new FileReader()

            reader.onload = e => {
                const thirdPreview = document.querySelector('.third-img')
                thirdPreview.src = e.target.result
            }
            reader.readAsDataURL(input.files[2])
        }
    }
    const inputImage = document.querySelector('.real-upload')
    inputImage.addEventListener('change', e => {
        readMultipleImage(e.target)
    })
}

async function getData(place_id, review_id) {
    const response = await fetch(`http://127.0.0.1:8000/reviews/details/${place_id}/${review_id}/`, {
        headers: {
            "authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET'
    })
        .then(response => response.json())
    console.log(response)


    const firstImage = document.querySelector('.slidelist li:nth-child(1) img')
    firstImage.src = "http://127.0.0.1:8000" + response.review_image_one
    const secondImage = document.querySelector('.slidelist li:nth-child(2) img')
    secondImage.src = "http://127.0.0.1:8000" + response.review_image_two
    const thirdImage = document.querySelector('.slidelist li:nth-child(3) img')
    thirdImage.src = "http://127.0.0.1:8000" + response.review_image_three

    const textarea = document.querySelector('textarea')
    textarea.value = response.content


    const updateReview = document.querySelector('#update-review')
    updateReview.onclick = async function () {

        const content = document.querySelector("textarea")
        const starOne = document.querySelector('#rate1')
        const starTwo = document.querySelector('#rate2')
        const starThree = document.querySelector('#rate3')
        const starFour = document.querySelector('#rate4')
        const starFive = document.querySelector('#rate5')

        // 경고문
        const overImageAlert = document.querySelector('#over-image-alert')
        const contentAlert = document.querySelector('#content-alert')
        const starAlert = document.querySelector('#star-alert')

        overImageAlert.style.display = "none"
        contentAlert.style.display = "none"
        starAlert.style.display = "none"

        if (starOne.checked) {
            content.classList.add('1');
            content.classList.remove("2", "3", "4", "5");
        }

        if (starTwo.checked) {
            content.classList.add('2');
            content.classList.remove("1", "3", "4", "5");
        }
        if (starThree.checked) {
            content.classList.add('3');
            content.classList.remove("2", "1", "4", "5");
        }

        if (starFour.checked) {
            content.classList.add('4');
            content.classList.remove("2", "3", "1", "5");
        }
        if (starFive.checked) {
            content.classList.add('5');
            content.classList.remove("2", "3", "4", "1");
        }

        let cls = content.getAttribute("class");

        if (cls) {
            cls = cls.toString()
        } else {
            starAlert.style.display = "block"
        }

        const images = document.querySelector('.real-upload');
    if (content.value) {
        var formData = new FormData()
        formData.append("rating_cnt", cls)
        formData.append("content", content.value)
        if (images.files[0]) {
            formData.append("review_image_one", images.files[0])
        }
        if (images.files[1]) {
            formData.append("review_image_two", images.files[1])
        } if (images.files[2]) {
            formData.append("review_image_three", images.files[2])
        }

        const editResponse = await fetch(`http://127.0.0.1:8000/reviews/details/${place_id}/${review_id}/`, {
            headers: {
                "authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body: formData
        })
        const editResponseJson = await editResponse.json()

        if (editResponse.status == 200) {
            location.href = `review_detail.html?id=${review_id}&place=${place_id}&author=${response.author_id}`
   
        }
         }
    else {
        contentAlert.style.display = "block"}
}

}