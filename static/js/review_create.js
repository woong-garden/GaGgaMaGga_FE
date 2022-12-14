const place_id = location.href.split('?')[1].split('=')[1]
const review_id = location.href.split('?')[1].split('=')[1]

// 사진 미리보기
window.onload = () => {
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


// 리뷰 작성
async function createReview() {
    const content = document.querySelector("textarea")
    const starOne = document.querySelector('#rate1')
    const starTwo = document.querySelector('#rate2')
    const starThree = document.querySelector('#rate3')
    const starFour = document.querySelector('#rate4')
    const starFive = document.querySelector('#rate5')

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
    console.log(cls)

    if (cls) {
        cls = cls.toString()
    } else {
        const starAlert = document.querySelector('#star-alert')
        starAlert.style.display = "block"
    }

    const images = document.querySelector('.real-upload');

    if (content.value) {

        if (images.files.length == 3) {
            var formData = new FormData()
            formData.append("rating_cnt", cls)
            formData.append("content", content.value)
            formData.append("review_image_one", images.files[0])
            formData.append("review_image_two", images.files[1])
            formData.append("review_image_three", images.files[2])

            await fetch(`${backendBaseUrl}/reviews/${place_id}/`, {
                headers: {
                    "authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
                cache: 'no-cache',
                body: formData
            })
            // alert("후기 등록 완료")
            // window.history.back()
        }
        else if (images.files.length > 3) {
            const overImageAlert = document.querySelector('#over-image-alert')
            overImageAlert.style.display = "block"
        }
        else {
            const imageAlert = document.querySelector('#image-alert')
            imageAlert.style.display = "block"
        }
    }
    else {
        const contentAlert = document.querySelector('#content-alert')
        contentAlert.style.display = "block"
    }
}