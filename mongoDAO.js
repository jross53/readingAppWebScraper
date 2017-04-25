let mongo = require('mongodb').MongoClient;
const URL = `mongodb://127.0.0.1:27017/bookReader`;
const booksCollection = 'books';

exports.insertBook = function (book) {
    mongo.connect(URL, function (err, db) {
        if (err) {
            throw err;
        }

        db.collection(booksCollection).insertOne(book, function (err) {
            if (err) {
                throw err;
            }
            db.close();
        });
    });
};

exports.findOneByTitle = function (title, callbackFunc) {
    mongo.connect(URL, function (err, db) {
        if (err) {
            if(callbackFunc) return callbackFunc(err, null);
            else throw err;
        }

        db.collection(booksCollection).findOne({title: title}, {}, function (err, result) {
            if(callbackFunc) callbackFunc(err, result);
            db.close();
        });
    });
};

exports.findAll = function(callbackFunc) {
    mongo.connect(URL, function(err, db) {
        if (err) {
            return callbackFunc(err, null);
        }

        db.collection(booksCollection).find({}, {_id: 0}).toArray(function(err, items) {
            if(err) {
                throw err;
            }
            if(callbackFunc) callbackFunc(err, items);
            db.close();
        });
    });
};

exports.updateBook = function(title, data) {
    mongo.connect(URL, function(err, db) {
        if (err) throw err;

        db.collection(booksCollection)
            .updateOne(
                {title: title},
                {$set: data},
                function(err, result) {
                    db.close()
                }
            )
    })
};

exports.deleteAllBooks = function (callbackFunc) {
    mongo.connect(URL, function (err, db) {
        if (err) {
            return callbackFunc(err);
        }


        db.collection(booksCollection).deleteMany({}, function (err, result) {
            if(callbackFunc) callbackFunc(err, result);
                db.close()
            }
        )
    });
};