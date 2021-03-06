var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome ){

        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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
        deleteItem: function(type, id) {

            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function() {
            data.allItems.expense.forEach(function(cur) {
                cur.calcPercentage(data.totals.income);
            });
        },

        getPercentages: function() {
            var allPercentages = data.allItems.expense.map(function(cur) {
                return cur.getPercentage();
            });

            return allPercentages;
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit;
        
        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        
        dec = numSplit[1];

        return (type === 'expense'? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDomStrings: function() {
            return DOMStrings;
        },

        displayBudget: function(obj) {  

            var type;

            obj.budget > 0 ? type = 'income' : type = 'expense';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income') ;
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'expense');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentagelabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentagelabel).textContent = '---';
            }

        },

        displayMonth: function() {
            var now, year, month, months;
            now = new Date();

            months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changeType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel)



            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        document.querySelector(Dom.inputType).addEventListener('change', UICntrl.changeType);
    }

    var updateBudget = function() {
        
        budgetCntrl.calculateBudget();

        var budget = budgetCntrl.getBudget();

        UICntrl.displayBudget(budget);

    };

    var updatePercentages = function() {
        budgetCntrl.calculatePercentages();

        var percentages = budgetCntrl.getPercentages();

        UICntrl.displayPercentages(percentages);
    };

    var cntrlDeleteItem = function(event) {
        var itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            
            budgetCntrl.deleteItem(type, id);   
            
            UICntrl.deleteListItem(itemID);

            updateBudget();

            updatePercentages();
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

            updatePercentages();
        }
        
  
    }       

    return {
        init: function() {
            console.log('Application has started,');
            UICntrl.displayMonth();
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

