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
    };

    var calculateTotal = function(type) {
        var sum = 0;
        
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {
            calculateTotal('expense');
            
            calculateTotal('income');

            data.budget = data.totals.income - data.totals.expense;
            
            if (data.totals.income > 0) {
                data.percentage = Math.round(data.totals.expense/data.totals.income * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            }
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
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentagelabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if (type === 'expense') {

                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {

                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDomStrings: function() {
            return DOMStrings;
        },

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentagelabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentagelabel).textContent = '---';
            }

        },

        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
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

        document.querySelector(Dom.container).addEventListener('click', cntrlDeleteItem);
    }

    var updateBudget = function() {
        
        budgetCntrl.calculateBudget();

        var budget = budgetCntrl.getBudget();

        UICntrl.displayBudget(budget);

    }

    var cntrlDeleteItem = function(event) {
        var itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.splitID('-');
            type = splitID[0];
            id = splitID[1];
        }
    }


    var cntrlAddItem = function() {

        var input, newItem;

        input = UICntrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);

            UICntrl.addListItem(newItem, input.type);
    
            UICntrl.clearFields();
    
            updateBudget();
        }
        
  
    }       

    return {
        init: function() {
            console.log('Application has started,');

            UICntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });

            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();

