/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let readingApp = angular.module('readingApp', []);

readingApp.controller('BookController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.books = [];
        $scope.modelIsHidden = true;

        function getBooks() {
            $http.get('/books').then(displayBooks);
        }

        function displayBooks(books) {
            $scope.books = books.data;
        }

        $scope.getPercentage = function (book) {
            return Math.floor(book.currentPage / book.totalPages);
        };

        $scope.displayBook = function (book) {
            $scope.modelIsHidden = false;
            console.log(`Book clicked: ${book.title}`);
            $scope.selectedBook = book;
            $scope.currentPageNumber = book.currentPage;
            $scope.currentPage = book.pages[$scope.currentPageNumber - 1];
        };

        $scope.close = function (result) {
            $scope.modelIsHidden = true;
        };

        getBooks();
    }
]);