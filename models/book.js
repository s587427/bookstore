const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author', // 告訴mongodb這個author欄位跟author collection有關聯
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    // 當要求這個屬性時會調用這個方法
    if(this.coverImageName){
        // 靜態資源public所在位置/
        return path.join('/', coverImageBasePath, this.coverImageName) 
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath