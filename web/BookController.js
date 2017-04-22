/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let readingApp = angular.module('readingApp', []); //'ui.bootstrap.modal'

readingApp.controller('BookController', ['$scope', '$http', function($scope, $http) {
    $scope.books = [];

    function getBooks() {
        $http.get('/books').then(displayBooks);
    }

    function displayBooks(books) {
        // for(let index = 0; index < 10; index++) {
        //     books.data[index].percentageRead = 100;
        // }
        //
        // for(let index = 10; index < books.data.length; index++) {
        //     books.data[index].percentageRead = Math.floor(Math.random() * 101);
        // }

        $scope.books = books.data;
    }

    $scope.getPercentage = function(book) {
        console.log("Book current page: " + book.currentPage);
        console.log("Book total pages: " + book.totalPages);
        console.log(book.title + "percentage is " + book.currentPage / book.totalPages);
        return Math.floor(book.currentPage / book.totalPages);
    };

    $scope.displayBook = function(book) {
        console.log(`Book clicked: ${book.title}`);
        $scope.exampleModal = true;
    };
    // $scope.open = function() {
    //     $scope.exampleModal = true;
    // };

    $scope.ok = function() {
        $scope.exampleModal = false;
    };

    $scope.cancel = function() {
        $scope.exampleModal = false;
    };

    getBooks();
}]);