const mongoose = require('mongoose')
require("dotenv").config()

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number:{
    type: String,
    validate: {
        validator: function(v) {
//console.log(v)
            let splitedNum = v.split("-")
            //console.log(splitedNum)
            if(splitedNum.length===1&& v.length>=8){
        return true
            } else if (splitedNum[0].length===2||splitedNum[0].length===3){
                return true 
            } else {return false}
          
        },
        message: props => `${props.value} is not a valid phone number!`
      },
  }
    
    
   //String
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', noteSchema)