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
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    
            } else {
                ID = 0;
            }


            if (type === 'expense') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'income') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    }

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

        var input, newItem;

        input = UICntrl.getInput();
        newItem = budgetCntrl.addItem(input.type, input.description, input.val)
    }       

    return {
        init: function() {
            console.log('Application has started,');
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();

