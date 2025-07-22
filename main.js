//ITEM CONTROLLER
const itemCtrl = (function(){
    //item contructor
    const Item = function(id, description, amount, type, date){
        this.id = id;
        this.description = description;
        this.amount = parseFloat(amount);
        this.type = type; // 'income' or 'expense'
        this.date = date || new Date().toISOString();
    }
    //data structure
    const data = {
        items: []
    }
    
    // Load data from localStorage
    const loadData = function() {
        const storedData = localStorage.getItem('budgetData');
        if (storedData) {
            data.items = JSON.parse(storedData);
        }
    }
    
    // Save data to localStorage
    const saveData = function() {
        localStorage.setItem('budgetData', JSON.stringify(data.items));
    }
    
    //public method
    return{
        logData: function(){
            return data;
        },
        addMoney: function(description, amount, type){
            //create random id
            let ID = itemCtrl.createID();
            //create new item
            newMoney = new Item(ID, description, amount, type);
            //push it into the array
            data.items.push(newMoney);
            // Save to localStorage
            saveData();

            return newMoney;
        },
        createID: function(){
            //create random id number between 0 and 10000
            const idNum = Math.floor(Math.random()*10000);
            return idNum;
        },
        getIdNumber: function(item){
            //get the item id
            const amountId = (item.parentElement.id);
            //break the id into an array
            const itemArr = amountId.split('-');
            //get the id number
            const id = parseInt(itemArr[1]);

            return id;
        },
        deleteAmountArr: function(id){
            //get all the ids
            const ids = data.items.map(function(item){
                //return item with id
                return item.id
            });
            //get index
            const index = ids.indexOf(id)
            //remove item
            data.items.splice(index, 1);
            // Save to localStorage
            saveData();
        },
        getItems: function() {
            return data.items;
        },
        clearAllData: function() {
            data.items = [];
            saveData();
        },
        init: function() {
            loadData();
        }
    }
})();

//UI CONTROLLER
const UICtrl = (function(){
    //ui selectors
    const UISelectors = {
        incomeBtn: '#add__income',
        expenseBtn: '#add__expense',
        clearAllBtn: '#clear__all',
        description: '#description',
        amount: '#amount',
        moneyEarned: '#amount__earned',
        moneyAvailable: '#amount__available',
        moneySpent: '#amount__spent',
        incomeList: '#income__container',
        expensesList: '#expenses__container',
        incomeItem: '.income__amount',
        expenseItem: '.expense__amount',
        itemsContainer: '.items__container',
        messageContainer: '.message__container'
    }
    
    // Show message function
    const showMessage = function(message, type = 'success') {
        // Remove existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Insert message
        const container = document.querySelector('.container');
        container.insertBefore(messageEl, container.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
    
    //public methods
    return{
        //return ui selectors
        getSelectors: function(){
            return UISelectors
        },
        getDescriptionInput: function(){
            return {
                descriptionInput: document.querySelector(UISelectors.description).value.trim()
            }
        },
        getValueInput: function(){
            return{
                amountInput: document.querySelector(UISelectors.amount).value
            }
        },
        validateInput: function(description, amount) {
            if (!description) {
                showMessage('Please enter a description', 'error');
                return false;
            }
            if (!amount || amount <= 0) {
                showMessage('Please enter a valid amount greater than 0', 'error');
                return false;
            }
            if (isNaN(amount)) {
                showMessage('Please enter a valid number', 'error');
                return false;
            }
            return true;
        },
        addIncomeItem: function(item){
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'item income'
            //add id to the item
            div.id = `item-${item.id}`
            //add html
            div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__income">
                <p class="symbol">$</p>
                <span class="income__amount">${item.amount.toFixed(2)}</span>
            </div>
            <small class="item__date">${new Date(item.date).toLocaleDateString()}</small>
            <i class="far fa-trash-alt"></i>
            `;
            //insert income into the list
            document.querySelector(UISelectors.incomeList).insertAdjacentElement('beforeend', div);
            showMessage('Income added successfully!', 'success');
        },
        clearInputs: function(){
            document.querySelector(UISelectors.description).value = ''
            document.querySelector(UISelectors.amount).value = ''
            document.querySelector(UISelectors.description).focus();
        },
        updateEarned: function(){
            //all income elements
            const allIncome = document.querySelectorAll(UISelectors.incomeItem);
            //array with all incomes
            const incomeCount = [...allIncome].map(item => +item.innerHTML);
            //calculate the total earned
            const incomeSum = incomeCount.reduce(function(a,b){
                return a+b
            },0);
            //display the total earned
            const earnedTotal = document.querySelector(UISelectors.moneyEarned).innerHTML = incomeSum.toFixed(2);
        },
        addExpenseItem: function(item){
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'item expense'
            //add id to the item
            div.id = `item-${item.id}`
            //add html
            div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__expense">
                <p class="symbol">$</p>
                <span class="expense__amount">${item.amount.toFixed(2)}</span>
            </div>
            <small class="item__date">${new Date(item.date).toLocaleDateString()}</small>
            <i class="far fa-trash-alt"></i>
            `;
            //insert income into the list
            document.querySelector(UISelectors.expensesList).insertAdjacentElement('beforeend', div);
            showMessage('Expense added successfully!', 'success');
        },
        updateSpent: function(){
            //all expenses elements
            const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
            //array with all expenses
            const expenseCount = [...allExpenses].map(item => +item.innerHTML)
            //calculate the total
            const expenseSum = expenseCount.reduce(function(a, b){
                return a+b
            },0)
            // display the total spent
            const expensesTotal = document.querySelector(UISelectors.moneySpent).innerHTML = expenseSum.toFixed(2);
        },
        updateAvailable: function(){
            const earned = document.querySelector(UISelectors.moneyEarned);
            const spent = document.querySelector(UISelectors.moneySpent)
            const available = document.querySelector(UISelectors.moneyAvailable);
            const availableAmount = ((+earned.innerHTML)-(+spent.innerHTML)).toFixed(2);
            available.innerHTML = availableAmount;
            
            // Add visual feedback for negative balance
            const availableEl = document.querySelector('#available');
            if (availableAmount < 0) {
                availableEl.style.color = 'var(--red)';
            } else {
                availableEl.style.color = 'var(--green)';
            }
        },
        deleteAmount: function(id){
            //create the id we will select
            const amountId = `#item-${id}`;
            //select the amount with the id we passed
            const amountDelete = document.querySelector(amountId);
            //remove from ui
            amountDelete.remove();
            showMessage('Item deleted successfully!', 'success');
        },
        loadItems: function() {
            const items = itemCtrl.getItems();
            items.forEach(item => {
                if (item.type === 'income') {
                    this.addIncomeItem(item);
                } else if (item.type === 'expense') {
                    this.addExpenseItem(item);
                }
            });
            this.updateEarned();
            this.updateSpent();
            this.updateAvailable();
        },
        clearAllData: function() {
            // Clear UI
            document.querySelector(UISelectors.incomeList).innerHTML = '<h2>📈 Income</h2>';
            document.querySelector(UISelectors.expensesList).innerHTML = '<h2>📉 Expenses</h2>';
            // Reset totals
            document.querySelector(UISelectors.moneyEarned).innerHTML = '0.00';
            document.querySelector(UISelectors.moneySpent).innerHTML = '0.00';
            document.querySelector(UISelectors.moneyAvailable).innerHTML = '0.00';
            // Reset available color
            document.querySelector('#available').style.color = 'var(--green)';
            showMessage('All data cleared successfully!', 'success');
        }
    }
})();

//APP CONTROLLER
const App = (function(){
    //event listeners
    const loadEventListeners = function(){
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();
        //add new income
        document.querySelector(UISelectors.incomeBtn).addEventListener('click', addIncome);
        //add new expense
        document.querySelector(UISelectors.expenseBtn).addEventListener('click', addExpense);
        //delete item
        document.querySelector(UISelectors.itemsContainer).addEventListener('click', deleteItem);
        //clear all data
        document.querySelector(UISelectors.clearAllBtn).addEventListener('click', clearAllData);
        
        // Add keyboard support
        document.querySelector(UISelectors.description).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addIncome();
            }
        });
        
        document.querySelector(UISelectors.amount).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addIncome();
            }
        });
    }

    //add new income
    const addIncome = function(){
        //get description and amount values
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //if inputs are not empty
        if(UICtrl.validateInput(description.descriptionInput, amount.amountInput)){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput, 'income');
            //add item to the list
            UICtrl.addIncomeItem(newMoney);
            //clear inputs
            UICtrl.clearInputs();
            //update earned
            UICtrl.updateEarned();
            //calculate money available
            UICtrl.updateAvailable();
        }
    }

    //add new expense
    const addExpense = function(){
        //get description and amount values
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //if inputs are not empty
        if(UICtrl.validateInput(description.descriptionInput, amount.amountInput)){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput, 'expense');
            //add item to the list
            UICtrl.addExpenseItem(newMoney);
            //clear inputs
            UICtrl.clearInputs();
            //update total spent
            UICtrl.updateSpent();
            //calculate money available
            UICtrl.updateAvailable();
        }
    }

    //delete item
    const deleteItem = function(e){
        if(e.target.classList.contains('far')){
            //get id number
            const id = itemCtrl.getIdNumber(e.target)
            //delete amount from ui
            UICtrl.deleteAmount(id);
            //delete amount from data
            itemCtrl.deleteAmountArr(id);
            //update earned
            UICtrl.updateEarned();
            //update total spent
            UICtrl.updateSpent();
            //calculate money available
            UICtrl.updateAvailable();
        }

        e.preventDefault()
    }

    //clear all data
    const clearAllData = function(){
        if(confirm('Are you sure you want to clear all data? This action cannot be undone.')){
            itemCtrl.clearAllData();
            UICtrl.clearAllData();
        }
    }

    //init function
    return{
        init: function(){
            // Initialize item controller
            itemCtrl.init();
            // Load event listeners
            loadEventListeners();
            // Load stored items
            UICtrl.loadItems();
        }
    }

})(itemCtrl, UICtrl);

App.init();