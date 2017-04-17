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
let finishedBooks = [];

const pageSize = 1000;

//debugger;

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
        //console.log(`Title: ${book.title}`);
        //console.log(book.contents);
        sectionize(book);
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

function sectionize(book) {
    let content = book.contents;
    let totalChars = content.length;
    let lastIndex = 0;
    let cleanBreak = false;
    let pageIncrement = pageSize;
    let pageCounter = 0;
    let pagedBook = {};

    console.log("In sectionize");
    console.log("Book is " + book.title);
    pagedBook.title = book.title;
    console.log("In pagedBook, the title is : " + pagedBook.title);
    pagedBook.percentageRead = 0;
    pagedBook.pages = [];

    for(i = 0; i < totalChars; i = pageIncrement) {
        console.log("Page " + (pageCounter + 1));
        lastIndex = i + pageSize;
        console.log("i is " + i);
        console.log("Last Index = " + lastIndex);
        let pageEndChar = content.charAt(lastIndex); //find last char on page
        console.log("Page end char for this page is : " + pageEndChar);
        if (/[a-zA-Z0-9]/.test(pageEndChar) == true) //see if it splits cleanly by miraculous chance
        {
            console.log("Char is alphanumeric");
            for(j = lastIndex; cleanBreak === false; j--) {
                console.log("In backup loop");

                lastIndex = j - 1;
                console.log("Last Index is " + lastIndex);
                pageEndChar = content.charAt(lastIndex);
                console.log("New page end char is : " + pageEndChar);
                if (/[a-zA-Z0-9]/.test(pageEndChar) == false) { //if it meets the condition for page break, which is nonalphanumeric
                    console.log("New page end char is not alphanumeric");
                    cleanBreak = true; //then break out
                }
            }
        }
        else {
            console.log("Char is not alphanumeric");
        }
        //console.log("Does it ever get here?");
        let pageContent = content.substring(i, lastIndex + 1);
        pagedBook.pages.splice(pageCounter, 0, pageContent);
        //console.log(pageContent);
        pageIncrement = 1 + lastIndex;
        cleanBreak = false;
        lastIndex = 0;
        pageCounter++;
    }
    console.log(pagedBook.pages);
    finishedBooks.push(pagedBook);
}

scrapeWebPage();
