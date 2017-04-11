/**
 * Created by Jordan.Ross on 4/11/2017.
 */
console.log('Starting node...');

let express = require('express');
let app = express();
let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');

let thHundredBooksUrl = 'http://thehundredbooks.com/';

function getBookContentsForAllBooks(hrefForAllBooks) {
    let books = [];
    let countAdded = 0;
    let hrefCount = hrefForAllBooks.length;

    hrefForAllBooks.forEach(book => {
        let url = `${thHundredBooksUrl}${book.href}`;

        request(url, function (error, response, html) {
            if (!error) {
                const $ = cheerio.load(html);
                let text = $(`a[href*='twitter']`).parent().text();
                books.push({title: book.title, contents: text});
                countAdded++;
                if (countAdded === hrefCount) {
                    saveBooks(books);
                }
            } else {
                console.err(error);
            }
        });

    });

    return books;
}

function scrapeWebPage() {
    request(thHundredBooksUrl, function (error, response, html) {
        if (!error) {
            const $ = cheerio.load(html);

            let hrefForAllBooks = getHrefForAllBooks($);
            getBookContentsForAllBooks(hrefForAllBooks);


        } else {
            console.err(error);
        }
    });
}

function saveBooks(books) {
    books.forEach(book => {
        console.log(`Title: ${book.title}`);
        console.log(book.contents);
    });
}

function getHrefForAllBooks($) {
    let hrefArray = [];

    $('#cse-search-box').parent().children().each(function () {
        let href = $(this).attr('href');
        if (href && href.indexOf(".htm") !== -1) {
            hrefArray.push({title: $(this).text(), href: href});
        }
    });

    return hrefArray;
}

scrapeWebPage();
