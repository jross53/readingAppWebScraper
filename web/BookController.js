/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let readingApp = angular.module('readingApp', []);

readingApp.controller('BookController', ['$scope', '$http', function($scope, $http) {
    $scope.test = "hi there";
    function getBooks() {
        $http.get('/books').then(displayBooks);
    }

    $scope.getBook = function (title) {
        $http.get('/book/getPages', {params: {title: title}}).then(displayBook);
    };

    function displayBooks(books) {
        $scope.books = books.data;
    }

    function displayBook(book) {

    }

    getBooks();
}]);