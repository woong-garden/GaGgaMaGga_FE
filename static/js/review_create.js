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

// window.onload = () => {
//     const realUpload = document.querySelector('.real-upload');
//     const upload = document.querySelector('.upload');

//     upload.addEventListener('click', () => realUpload.click());

//     function readMultipleImage(input) {
//         const slideList = document.querySelector('.slidelist')
//         if (input.files) {
            

//             const fileArr = Array.from(input.files)
//             fileArr.forEach(file => {
//                 const reader = new FileReader()

//                 const liTag = document.createElement('li')
//                 const image = document.createElement('img')
//                 image.classList.add('first-img')
//                 liTag.appendChild(image)

//                 ReadableStream.onload = e => {
//                     image.src = e.target.result
//                 }
//                 reader.readAsDataURL(file)
//             })
//             slideList.appendChild(liTag)
//         }
//     }
// //     const multipleImage = document.querySelector('.real-upload')
// //     multipleImage.addEventListener('change', e=> {
// //         readMultipleImage(e.target)
// //     })
// }