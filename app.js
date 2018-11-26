var budgetController = (function() {



})();


var UIController = (function() {


})();


var controller = (function(budgetCntrl, UICntrl) {

    var cntrlAddItem = function() {
        console.log('It works!!')
    }

    document.querySelector('.add__btn').addEventListener('click', cntrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            cntrlAddItem();
        }
    });

})(budgetController, UIController);