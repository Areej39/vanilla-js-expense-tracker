//script.js expense-tracker

const balance = document.getElementById('balance');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const submitBtn = transactionForm.querySelector('.btn');
const formTitle = document.getElementById('formTitle');

let transactions = [];
let editId = null;
let editingElement = null;

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    const expense = (
        amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    balance.textContent = `$${total}`;
    incomeAmount.textContent = `$${income}`;
    expenseAmount.textContent = `$${expense}`;
}

function addTransactionDOM(transaction) {
    const li = document.createElement("li");

    const sign = transaction.amount > 0 ? '+': '-';

    li.classList.add(transaction.amount > 0 ? 'income': 'expense');

    li.innerHTML = `
    <span>${transaction.text}</span>
    <div>
         <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
         <button class="edit-btn" onclick="editTransaction(${transaction.id}, this)">Edit</button>
         <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button>
    </div>
    `;
    transactionList.appendChild(li);
}

function addTransaction(e) {
    e.preventDefault();

    const text = textInput.value.trim();
    const amount = Number(amountInput.value);

    if(text === '' || isNaN(amount) || amount === 0) {
        alert("Please fill all fields");
        return;
    }

    if(editId !== null) {
        const transaction = transactions.find(trans => trans.id === editId);

        transaction.text = text;
        transaction.amount = amount;
        editId = null;

        if (editingElement) {
        editingElement.classList.remove('editing');
        editingElement = null;
        }

        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.remove();
        }

        formTitle.textContent = 'Add New Transaction';
        submitBtn.textContent = 'Add Transaction';
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        
    } else {
        const transaction = {
            id: Date.now(),
            text,
            amount
        };
    
        transactions.push(transaction);
        addTransactionDOM(transaction);
    } 

    updateValues();
    textInput.value = '';
    amountInput.value ='';
}

function removeTransaction(id) {
    if (editId === id) {
        editId = null;
        textInput.value = '';
        amountInput.value = '';
        submitBtn.textContent = 'Add Transaction';
        formTitle.textContent = 'Add New Transaction';

        if (editingElement) { 
            editingElement.classList.remove('editing');
            editingElement = null; 
        }
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) { cancelBtn.remove(); }
    }
    
    transactions = transactions.filter(transaction => transaction.id !== id);
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

function editTransaction(id, button) {
    const transaction = transactions.find(trans => trans.id === id);

    if (!transaction) return;

    textInput.value = transaction.text;
    amountInput.value = transaction.amount;
    editId = id;
    submitBtn.textContent = 'Update Transaction';
    formTitle.textContent = 'Edit Transaction';

    document.querySelectorAll('#transactionList li').forEach(li => li.classList.remove('editing'));
    editingElement = button.closest('li');
    editingElement.classList.add('editing');

    const existingCancelBtn = document.getElementById('cancelBtn'); 
    if (existingCancelBtn) { existingCancelBtn.remove(); }

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel Edit';
    cancelBtn.classList.add('cancel-btn');
    cancelBtn.type = 'button';
    cancelBtn.id = 'cancelBtn';

    transactionForm.appendChild(cancelBtn);

    cancelBtn.addEventListener('click', () => {
        editId = null;
        textInput.value = '';
        amountInput.value = '';

        submitBtn.textContent = 'Add Transaction';
        formTitle.textContent = 'Add New Transaction';
        if (editingElement) {
            editingElement.classList.remove('editing');
            editingElement = null;
        }

        cancelBtn.remove();
    });   
}

transactionForm.addEventListener('submit', addTransaction);

updateValues();