/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let readingApp = angular.module('readingApp', ['ngSanitize', 'rzModule']);

readingApp.controller('BookController', ['$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
        $scope.books = [];
        $scope.modalIsHidden = true;
        $scope.showFontSlider = false;
        $scope.defaultSliderValue = 6;
        $scope.nightVisionIsEnabled = false;
        $scope.nightVisionTooltipText = "";

        function createSlider() {
            //the slider range is 0 to 70
            //the actual font range is 8px to 78px, but for a better user experience the slider values are offset
            $scope.slider = {
                value: $scope.defaultSliderValue,
                options: {
                    showSelectionBar: true,
                    floor: 0,
                    ceil: 70,
                    step: 1
                }
            };
        }

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

        $scope.close = function () {
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

        //this handles if the modal is closed in a way other than the close button
        angular.element('#readBookModal').on('hide.bs.modal', function() {
            $scope.close();
        });

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

        $scope.toggleFontSliderVisible = function () {
            $scope.showFontSlider = !$scope.showFontSlider;
            if ($scope.showFontSlider === true) {
                initializeSlider();
            }
        };

        function initializeSlider() {
            //when the slider is initialized it isn't visible which causes the slider to not render correctly
            //this code causes the slider to be rendered correctly when it is made visible
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        }

        function toggleNightVisionToolTipText() {
            $scope.nightVisionTooltipText = $scope.nightVisionIsEnabled ? 'Day Mode' : 'Night Mode';
        }

        $scope.toggleNightVision = function() {
            $scope.nightVisionIsEnabled = !$scope.nightVisionIsEnabled;
            toggleNightVisionToolTipText();
        };

        createSlider();
        getBooks();
        toggleNightVisionToolTipText();
    }
]);