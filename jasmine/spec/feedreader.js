/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* This test loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('each feed URL is defined and not empty', function(){
            allFeeds.forEach(function(feed){
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toEqual('');
            });
        });


        /* This test loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
         it('each feed name is defined and not empty', function(){
            allFeeds.forEach(function(feed){
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toEqual('');
            });
         });

    });

    describe('The menu',function(){

        var $body = $('body'),
            $menuIcon = $('.menu-icon-link');

        /* This test ensures the menu element is
         * hidden by default. We check that the body
         * element has class menu-hidden by default
         */
        it('menu element is hidden by default', function(){
           var bodyHasClass = $body.hasClass("menu-hidden");
           expect(bodyHasClass).toBe(true);
        });

         /* This test ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * check that when menuIcon is clicked class menu-hidden
          * is removed from the body element.
          */
        it('menu shows when menu icon clicked', function(){
            $menuIcon.trigger('click');
            expect($body.hasClass("menu-hidden")).toBe(false);
        });        

        it('menu hides when menu icon clicked again', function(){
            $menuIcon.trigger('click');
            expect($body.hasClass("menu-hidden")).toBe(true);
        });
    });

    describe('Initial Entries', function(){

        /* This test ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * We use the done() function in beforeEach. That way the "it"
         * statement will not be evaulated until the beforeEach function
         * has finished.
         */
        var $entries;
        beforeEach(function(done){
            loadFeed(0, done);
        });

        it('ensures loadFeed is called and completes its work',function(){
            var $entries = $('.feed .entry');
            expect($entries.length).toBeGreaterThan(0);
        });
    });


    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function(){

        var $title, // $title: stores the text in the '.header-title' element
            $feedEntries, // $feedEntries: stores all feed entries '.feed .entry h2'
            titleList = [], // titleList: stores text of all different titles loaded by all ajax calls
            feedEntriesNodeList = [], // feedEntriesNodeList: will store list of nodes
            $feedList = $('.feed-list a'); // $feedList: stores all links from which we take data via Ajax

        /* Before any test is run, we store all relevant data
        * from the asynchronous requests.
        * We populate titleList and feedEntriesNodeList.
        */
        $feedList.each(function(index, item){
            beforeAll(function(done){
                loadFeed(index, function(){
                    $title = $('.header-title').text();
                    $feedEntries = $('.feed .entry h2');
                    titleList.push($title);
                    feedEntriesNodeList.push($feedEntries);
                    done();
                });
            });
        });

        /* This test ensures that the 4 different Ajax
        * load different titles
        */
        it("loadFeed loads different titles",function(){
            var titleContainsRepeatedValues = containsRepeatedValues(titleList);
            expect(titleContainsRepeatedValues).toBe(false);
        });

        /* This test ensures that the 4 different Ajax
        * load feed lists
        */
        it("loadFeed loads feed list that are different",function(){
            var stringList = turnNodeArrayIntoStringArray(feedEntriesNodeList);
            var stringListDifferentLists = arrayOfDifferentArrays(stringList);
            expect(stringListDifferentLists).toBe(true);
        });
    });
}());

/* This function turns an array of arrays of html h2 nodes
* into an array of arrays of strings
* input: array of array of h2 nodes
* output: array of array of strings
*/
function turnNodeArrayIntoStringArray(arrayNodes){
    var stringArray=[];
    arrayNodes.forEach(function(element){
        var elementArray = [];
        element.each(function(index, title){
            elementArray.push(title.innerHTML);
        });
        stringArray.push(elementArray);
    });
    return stringArray;
};

/* This function returns true if two arrays contain
 * any element that is not contained by the other
 * and false if not
 * input: array1: array of strings
 * input: array2: array of strings
 * output: true or false
 */
function arraysContainDifferentElements(array1, array2){
    var difference1 = array1.filter(function(element){
        return array2.indexOf(element)<0;
    });
    var difference2 = array2.filter(function(element){
        return array1.indexOf(element)<0;
    });
    var totalDifference = difference1.length + difference2.length;
    if (totalDifference == 0){
        return false;
    } else {
        return true;
    }
};

/* This function checks if all elements of an 
 * array of arrays are different to each other.
 * input: array of arrays
 * output: true or false
 */
function arrayOfDifferentArrays(arrayOfArrays){
    var areArraysDifferent = true;
    arrayOfArrays.forEach(function(element,index){
        for (var i = index+1; i<arrayOfArrays.length; i++) {
            if (! arraysContainDifferentElements(element, arrayOfArrays[i])){
                areArraysDifferent = false;
            }
        };
    });
    return areArraysDifferent;
};

/* This function checks if all elements of an 
 * array are unique.
 * input: array of strings
 * output: true or false
 */
function containsRepeatedValues(array){
    var maxIndex = -1;
    array.forEach(function(element, index){
        if (array.indexOf(element, index + 1) > maxIndex){
            maxIndex = array.indexOf(element, index+1);
        };
    })
    if (maxIndex === -1){
        return false;
    } else {
        return true;
    }
};











