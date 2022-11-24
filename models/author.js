const mongoose = require('mongoose')

// Schema基本上就是一個table的意思
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// mongoose.model(tableName, Schema) «Model» The model associated with name. Mongoose will create the model if it doesn't already exist.

module.exports = mongoose.model('Author', authorSchema)


// 模型的實例稱為文檔
// 模型負責從底層 MongoDB 數據庫創建和讀取文檔