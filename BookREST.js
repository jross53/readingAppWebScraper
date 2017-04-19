/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let express = require('express');
let router = express.Router();
let mongoDAO = require('./mongoDAO');

router.get('/book/getPages', function (req, res) {
    let title = req.query.title;
    mongoDAO.findOneByTitle(title, function(err, book) {
        if(err) {
            throw err;
        }

        res.status(200).send(book.pages);
    });

});

router.get('/books', function (req, res) {
    mongoDAO.findAll(function(err, books) {
        if(err) {
            throw err;
        }

        res.status(200).send(books);
    });
});

module.exports = router;
