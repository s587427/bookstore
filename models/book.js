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
    // 存在主機資料夾的作法
    // coverImageName: {
    //     type: String,
    //     required: true
    // },

    // 直接儲存到database
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author', // 告訴mongodb這個author欄位跟author collection有關聯
    }
})

bookSchema.virtual('coverImagePath').get(function () {
    // 當要求這個屬性時會調用這個方法

    // 檔案上傳
    // if(this.coverImageName){
    //     // 靜態資源public所在位置/
    //     return path.join('/', coverImageBasePath, this.coverImageName) 
    // }

    // database讀取
    if (this.coverImage && this.coverImageType) {
        const base64String = this.coverImage.toString('base64')
        return `data:${this.coverImageType};base64,${base64String}`
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath