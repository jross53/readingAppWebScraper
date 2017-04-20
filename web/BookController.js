/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let readingApp = angular.module('readingApp', []);

readingApp.controller('BookController', ['$scope', '$http', function($scope, $http) {
    $scope.books = [];

    function getBooks() {
        $http.get('/books').then(displayBooks);
    }

    $scope.getBook = function (title) {
        $http.get('/book/getPages', {params: {title: title}}).then(displayBook);
    };

    function displayBooks(books) {
        for(let index = 0; index < books.data.length; index += 2) {
            books.data[index].percentageRead = Math.floor(Math.random() * 100);
        }

        $scope.books = books.data;
    }

    function displayBook(book) {

    }

    getBooks();
}]);