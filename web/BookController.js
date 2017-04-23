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
            //if(book.title === "Moby-Dick") console.log(`${book.title} is at ${book.currentPage} of ${book.totalPages}`);
            if(book.currentPage !== 1) return Math.floor((book.currentPage / book.totalPages) * 100);
            else return 0;
        };

        $scope.displayBook = function (book) {
            $scope.modelIsHidden = false;
            console.log(`Book clicked: ${book.title}`);
            $scope.selectedBook = book;
            $scope.currentPageNumber = book.currentPage;
            $scope.currentPage = book.pages[$scope.currentPageNumber - 1];
        };

        $scope.close = function (result) {
            let data = {"currentPage": $scope.currentPageNumber};
            console.log(`Current page number is ${$scope.currentPageNumber}`);
            console.log(`Data is sent as ${JSON.stringify(data)}`);
            $http.put(`/book/${$scope.selectedBook.title}.json`, data)
                .then(
                    function(response){
                        // success callback
                        console.log(`Success, response: ${response}`);
                    },
                    function(response){ //its calling this when the page is reloaded for some reason?
                        // failure callback
                        console.log(`Failure, response: ${response}`);
                    }
                );
            $scope.modelIsHidden = true;
        };

        $scope.pageForward = function(book) {
            if($scope.currentPageNumber !== book.totalPages) {
                $scope.currentPage = book.pages[$scope.currentPageNumber];
                $scope.currentPageNumber++;
            }
            else {
                alert(`You finished ${book.title}`);
            }
        };

        $scope.pageBack = function(book){
            if($scope.currentPageNumber > 1) {
                $scope.currentPage = book.pages[$scope.currentPageNumber - 2];
                $scope.currentPageNumber--;
            }
        };

        getBooks();
    }
]);