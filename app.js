var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

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

    var setupEventListeners = function() {

        var Dom = UICntrl.getDomStrings();

        document.querySelector(Dom.inputButton).addEventListener('click', cntrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                cntrlAddItem();
            }
        });
    }


    var cntrlAddItem = function() {
        var input = UICntrl.getInput();
        console.log(input)
    }

    return {
        init: function() {
            console.log('Application has started,');
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();

