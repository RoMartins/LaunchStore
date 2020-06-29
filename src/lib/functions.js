module.exports = {
    age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let age = today.getFullYear() - birthDate.getFullYear()
        const mounth = today.getMonth() - birthDate.getMonth()

        if (mounth < 0 || mounth == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }
        return age
    },

    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getFullYear()
        const mounth = `0${date.getMonth() +1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hour = date.getHours()
        const minutes = date.getMinutes()

        return {
            day,
            year,
            mounth,
            hour,
            minutes,        
            iso:`${year}-${mounth}-${day}`,
            format:`${day}/${mounth}/${year}`
        }
    },

    FormatPrice(price){
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100)

    
    },

    FormatCpfCnpj(value){
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

 FormatCep(value){
    value = value.replace(/\D/g, "")

    if(value.length>8){
        value = value.slice(0, -1)

        
    }
    value = value.replace(/(\d{5})(\d)/,"$1-$2")
     return value
    },
}

