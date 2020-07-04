const Validate = {
    apply(input, func) {
        Validate.clearError(input)

            let results = Validate[func](input.value)
            input.value = results.value

            if(results.error)
                Validate.displayError(input, results.error)

    },
    isEmail(value){
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat))
            error = "Email Inválido"
        
        return {
            error,
            value
        }
    },
    displayError(input, error){
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearError(input){
        const errorDiv = input.parentNode.querySelector(".error")
        if(errorDiv)
            errorDiv.remove()
    },
    isCep(value){
        let error =null
        const cleanValues = value.replace(/\D/g,"")

        if(cleanValues.length !==8){
            error ="Cep Inválido"
        }

        return {
            error,
            value
        }
    },
    allFields(e){
        let inputs = document.querySelectorAll('.item input, .item textarea, .item select')

        for(input of inputs){
            if(input.value == ""){
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.innerHTML = "Preencha todos os campos!"
                document.querySelector('body').append(message)
                //alert("prencha todos os campos")
                e.preventDefault()
            } 
        }

    }
}

const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "")

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    },
    cpfCnpj(value){
        value = value.replace(/\D/g, "")

        if(value.length>14){
            value = value.slice(0, -1)
        }
         if(value.length > 11){
            value = value.replace(/(\d{2})(\d)/,"$1.$2")
            value = value.replace(/(\d{3})(\d)/,"$1.$2")
            value = value.replace(/(\d{3})(\d)/,"$1/$2")
            value = value.replace(/(\d{4})(\d)/,"$1-$2")
         } else {
            value = value.replace(/(\d{3})(\d)/,"$1.$2")
            value = value.replace(/(\d{3})(\d)/,"$1.$2")
            value = value.replace(/(\d{3})(\d)/,"$1-$2")

         }
         return value
    },

Cep(value){
    value = value.replace(/\D/g, "")

    if(value.length>8){
        value = value.slice(0, -1)

        
    }
    value = value.replace(/(\d{5})(\d)/,"$1-$2")
     return value
},


}

const PhotosUpload = {
    input: "",
    preview: document.querySelector("#photos-preview"),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.LimitPhoto(event)) return
        
        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)    

            const reader = new FileReader()
        
            reader.readAsDataURL(file)
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.CreateContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

        })

       PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    CreateContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto
    
        div.appendChild(image)

        div.appendChild(PhotosUpload.CreateRemoveButton())

        return div
    },
    LimitPhoto(event) {
        const { uploadLimit, preview, files: fileListInput} = PhotosUpload
        const { files: fileList } = event.target

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo"){
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length

        if(totalPhotos > uploadLimit){
            if( fileListInput.length == uploadLimit){
            alert(`Você atingiu o limite de fotos`)
            return true

        } else {
            const disp = uploadLimit - fileListInput.length
            alert(`Você pode adicionar apenas mais ${disp} fotos`)
            event.preventDefault()
            return true
            
            }
            
        }

    return false

    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    CreateRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML="close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id){
            const removedFiles = document.querySelector("input[name=removed_files]")
            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }
        }


        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector(".gallery .highlight > img"),
    previews: document.querySelectorAll(".gallery-preview img"),
    setImage(e) {
        const {target} = e
        
        ImageGallery.previews.forEach( preview => preview.classList.remove("active"))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        LightBox.image.src = target.src
    }
}

const LightBox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-close'),
    open(){
        LightBox.target.style.opacity = 1
        LightBox.target.style.top = 0
        LightBox.target.style.bottom = 0
        LightBox.closeButton.style.top = 0
    },
    close() {
        LightBox.target.style.opacity = 0
        LightBox.target.style.top = "-100%"
        LightBox.target.style.bottom = "initial"
        LightBox.closeButton.style.top = "-80px"
    },
}