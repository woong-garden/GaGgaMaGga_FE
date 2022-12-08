window.onload = () => {
    const realUpload = document.querySelector('.real-upload');
    const upload = document.querySelector('.upload');

    upload.addEventListener('click', () => realUpload.click());

    function readMultipleImage(input) {
        if (input.files && input.files[0]){
            const reader = new FileReader()

            reader.onload = e => {
                const firstPreview = document.querySelector('.first-img')
                firstPreview.src = e.target.result
            }
            reader.readAsDataURL(input.files[0])
        }
        if (input.files && input.files[1]){
            const reader = new FileReader()

            reader.onload = e => {
                const secondPreview = document.querySelector('.second-img')
                secondPreview.src = e.target.result
            }
            reader.readAsDataURL(input.files[1])
        }
        if (input.files && input.files[2]){
            const reader = new FileReader()

            reader.onload = e => {
                const thirdPreview = document.querySelector('.third-img')
                thirdPreview.src = e.target.result
            }
            reader.readAsDataURL(input.files[1])
        }
    }
    const inputImage = document.querySelector('.real-upload')
    inputImage.addEventListener('change', e=> {
        readMultipleImage(e.target)
    })
}