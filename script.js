//script.js expense-tracker

const balance = document.getElementById('balance');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');

let transactions = [];

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

    const transaction = {
        id: Date.now(),
        text,
        amount
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    textInput.value = '';
    amountInput.value ='';
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

transactionForm.addEventListener('submit', addTransaction);

updateValues();