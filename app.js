var budgetController = (function() {



})();


var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };

        },

        getDomStrings: function() {
            return DOMStrings;
        }


    };

})();


var controller = (function(budgetCntrl, UICntrl) {

    var Dom = UICntrl.getDomStrings();

    var cntrlAddItem = function() {
        var input = UICntrl.getInput();
        console.log(input)
    }

    document.querySelector(Dom.inputButton).addEventListener('click', cntrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            cntrlAddItem();
        }
    });

})(budgetController, UIController);