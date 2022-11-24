const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// 全部的作者 Route
router.get('/', (req, res) => {
    res.render('authors/index')
})

// 新作者 Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// 創建作者的Route 

router.post('/', async (req, res) => {

    const author = new Author({
        name: req.body.name
    })

    // 透過save將資料存到資料庫
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }

})

module.exports = router