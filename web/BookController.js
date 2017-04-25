/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let readingApp = angular.module('readingApp', ['ngSanitize', 'rzModule']);

readingApp.controller('BookController', ['$scope', '$http', '$timeout', '$interval',
    function ($scope, $http, $timeout) {
        $scope.books = [];
        $scope.modalIsHidden = true;
        $scope.showFontSlider = false;
        $scope.defaultSliderValue = 6;
        $scope.slider = {
            value: 6,
            options: {
                showSelectionBar: true,
                floor: 0,
                ceil: 70,
                step: 1
            }
        };

        function getBooks() {
            $http.get('/books').then(displayBooks);
        }

        function displayBooks(books) {
            books.data.forEach(book => book.percentageRead = getPercentage(book));
            $scope.books = books.data;
        }

        function getPercentage(book) {
            if (book.currentPage !== 1) {
                return Math.floor((book.currentPage / book.totalPages) * 100);
            }

            return 0;
        }

        $scope.displayBook = function (book) {
            $scope.showFontSlider = false;
            $scope.modalIsHidden = false;
            $scope.selectedBook = book;
            $scope.currentPageNumber = book.currentPage;
            $scope.currentPage = book.pages[$scope.currentPageNumber - 1];
        };

        function fadeInBookImage() {
            $timeout(function () {
                $scope.modalIsHidden = true;
            }, 500);
        }

        $scope.close = function (result) {
            let data = {"currentPage": $scope.currentPageNumber};
            $http.put(`/book/${$scope.selectedBook.title}.json`, data)
                .then(
                    function (response) {
                        // success callback
                        console.log(`Success, response: ${response}`);
                    },
                    function (response) { //its calling this when the page is reloaded for some reason?
                        // failure callback
                        console.log(`Failure, response: ${response}`);
                    }
                );
            fadeInBookImage();
            $http.get('/books').then(displayBooks);
        };

        $scope.pageForward = function (book) {
            if ($scope.currentPageNumber !== book.totalPages) {
                $scope.currentPage = book.pages[$scope.currentPageNumber];
                $scope.currentPageNumber++;
            }
        };

        $scope.pageBack = function (book) {
            if ($scope.currentPageNumber > 1) {
                $scope.currentPage = book.pages[$scope.currentPageNumber - 2];
                $scope.currentPageNumber--;
            }
        };

        $scope.toggleFontSliderVisible = function() {
            $scope.showFontSlider = !$scope.showFontSlider;
            if($scope.showFontSlider === true) {
                initializeSlider();
            }
        };

        function initializeSlider() {
            // $timeout(function() {
            //     $scope.$broadcast('reCalcViewDimensions');
            // }, 250);
            //
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });

            // let currentValue = $scope.slider.value;
            // $scope.slider.value = 0;
            // for(let times = 0; times < currentValue; times++) {
            //     $timeout(function() {
            //         $scope.slider.value++;
            //     }, 200);
            // }
        }

        getBooks();
    }
]);