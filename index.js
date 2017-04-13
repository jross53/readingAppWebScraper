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

const pageSize = 500;

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
        console.log(`Title: ${book.title}`);
        console.log(book.contents);
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

function emptyTest() {

}

function sectionize(book) {
    let content = book.contents;
    let totalChars = content.length;
    let lastIndex = 0;
    let cleanBreak = false;
    let pageIncrement = pageSize;
    //alert("In sectionize");
    //alert(totalChars);
    //let pages = Math.ceil(totalChars/pageSize); //divide char count by max chars per page to find out number of pages
    //alert(pages);
    //var pages = bookText.match(/.{1,300}/g);
    for(i = 0; i < totalChars; i+= pageIncrement)
    {
        console.log("Page " + (i + 1));
        lastIndex = i + pageSize;
        let pageEndChar = content.charAt(lastIndex) //find last char on page
        if(pageEndChar != "" && pageEndChar != " " && /[^a-zA-Z0-9]/.test(pageEndChar) == true) //see if it splits cleanly by miraculous chance
        {
            for(j = lastIndex; cleanBreak == false; j--)
            {
                lastIndex = j - 1;
                pageEndChar = content.charAt(lastIndex);
                if(pageEndChar == "" || pageEndChar == " " || /[^a-zA-Z0-9]/.test(pageEndChar) == false){ //if it meets the condition for page break
                    cleanBreak = true; //then break out
                }
            }
        }
        let pageContent = content.substring(i, i + lastIndex + 1);
        console.log(pageContent);
        console.log("\r\n");
        //document.getElementById("pages").innerHTML += pageContent + "_____________________________";
        pageIncrement = lastIndex; //i + last index?
        cleanBreak = false;
        lastIndex = 0;
    }
    //document.getElementById("pagesDiv").innerHTML = pages;
    //pages.split(',');
}

scrapeWebPage();
