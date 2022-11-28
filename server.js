if (process.env.NODE_ENV !== 'production') {
    // 使用dotenv
    require('dotenv').config()
}
// console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`)


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

// app.set類似Object可以設定鍵與值, 有些鍵是內置的配置對象
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// 設定layout存放位置存在views底下
app.set('layout', 'layout/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const mongoose = require('mongoose')

// 建立db連線實例
// 返回的是一個promise
mongoose
    .connect(process.env.DATABASE_URL)
    .then(res => console.log('Connected to Mongoose'))
    .catch(err => console.log('連接失敗', err))


app.use(indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)


// 大多數人將routes視為路由控制器因此 routes詞彙基本上等於controller
