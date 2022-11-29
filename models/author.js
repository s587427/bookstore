const mongoose = require('mongoose')
const Book = require('../models/book')
// Schema基本上就是一個table的意思
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// 在執行remove之前檢查作者是否有書
authorSchema.pre('remove', function (next) {
    // 查詢結果會執行第二個參數的call back
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            // 傳入err，mongoose會自行斷開資料庫連接
            next(err)
        } else if (books.length) {
            next(new Error('作者還有書無法刪除!'))
        } else {
            next()
        }
    })
})

// mongoose.model(tableName, Schema) «Model» The model associated with name. Mongoose will create the model if it doesn't already exist.


// 建立一個collection是author
module.exports = mongoose.model('Author', authorSchema)

// 模型負責從底層 MongoDB 數據庫創建和讀取文檔