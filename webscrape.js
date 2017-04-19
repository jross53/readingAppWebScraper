/**
 * Created by Jordan.Ross on 4/11/2017.
 */
console.log('Starting node...');

let express = require('express');
let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let mongoDAO = require('./mongoDAO');

const thHundredBooksUrl = 'http://thehundredbooks.com/';
const pageSize = 1000;

mongoDAO.deleteAllBooks(function(err) {
    if(err) {
        throw err;
    }
    console.log('Deleted all books');
});

function getBookContentsForAllBooks(hrefForAllBooks) {
    console.log('Getting contents of all the books');

    let books = [];
    let countAdded = 0;
    let hrefCount = hrefForAllBooks.length;

    hrefForAllBooks.forEach(book => {
        let url = `${thHundredBooksUrl}${book.href}`;

        request(url, function (error, response, html) {
            if (!error) {
                const $ = cheerio.load(html);
                let text = $(`a[href*='twitter']`).parent().text();
                books.push({title: book.title.trim(), contents: text});
                countAdded++;
                if (countAdded === hrefCount) {
                    saveBooks(books);
                } else {
                    console.log(`Book count: ${countAdded}`);
                }
            } else {
                console.err(error);
            }
        });

    });

    return books;
}

function scrapeWebPage() {
    console.log('Starting to scrape the web page for books');
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
        let pagedBook = generateBookWithPages(book);
        mongoDAO.insertBook(pagedBook);
        console.log(`Book added: ${pagedBook.title}`);
    });
    console.log('All books have been saved');
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

function generateBookWithPages(book) {
    let content = book.contents;
    let totalChars = content.length;
    let lastIndex = 0;
    let cleanBreak = false;
    let pageIncrement = pageSize;
    let pageCounter = 0;
    let pagedBook = {};

    pagedBook.title = book.title;
    pagedBook.percentageRead = 0;
    pagedBook.pages = [];

    for (let i = 0; i < totalChars; i = pageIncrement) {
        lastIndex = i + pageSize;
        let pageEndChar = content.charAt(lastIndex); //find last char on page

        if (/[a-zA-Z0-9]/.test(pageEndChar) == true) //see if it splits cleanly by miraculous chance
        {
            for (let j = lastIndex; cleanBreak === false; j--) {
                lastIndex = j - 1;
                pageEndChar = content.charAt(lastIndex);
                if (/[a-zA-Z0-9]/.test(pageEndChar) == false) { //if it meets the condition for page break, which is nonalphanumeric
                    cleanBreak = true; //then break out
                }
            }
        }
        let pageContent = content.substring(i, lastIndex + 1);
        pagedBook.pages.splice(pageCounter, 0, pageContent);
        pageIncrement = 1 + lastIndex;
        cleanBreak = false;
        lastIndex = 0;
        pageCounter++;
    }
    return pagedBook;
}

scrapeWebPage();
