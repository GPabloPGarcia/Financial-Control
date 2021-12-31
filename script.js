const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const essential = document.querySelector('#essential');
const knowledge = document.querySelector('#knowledge');
const goal = document.querySelector('#goal');
const free = document.querySelector('#free');


const localStorageTransaction = JSON
    .parse(localStorage.getItem('transactions'));
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransaction : [];

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id != ID);
    updateLocalStorage();
    init();
}

const addTransactionIntoDOM = transaction => {
    const {
        id,
        name,
        amount
    } = transaction;
    const operator = amount < 0 ? '-' : '+';
    const cssClass = amount < 0 ? 'minus' : 'plus';
    const amountWhithoutOperator = Math.abs(amount).toFixed(2);
    const li = document.createElement('li');
    li.classList.add(cssClass);
    li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWhithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x<button/>`;
    transactionUl.append(li);
}

const segregateTotal = total => {
    essential.textContent = `R$ ${((55/100) * total).toFixed(2)}`;
    knowledge.textContent = `R$ ${((5/100) * total).toFixed(2)}`;
    goal.textContent = `R$ ${((30/100) * total).toFixed(2)}`;
    free.textContent = `R$ ${((10/100) * total).toFixed(2)}`;
}

const updateBalanceValues = () => {
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount);
    const total = transactionsAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2);
    const income = transactionsAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2);
    const expense = Math.abs(transactionsAmounts
            .filter(value => value < 0)
            .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2);
    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
    segregateTotal(income);
}

const init = () => {
    transactionUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

const generateID = () => Math.round(Math.random() * 1000);

init();

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    if (inputTransactionName.value.trim() === '' || inputTransactionAmount.value.trim() === '') {
        alert('Por favor preencha tanto o nome quanto o valor da transação');
        return;
    }
    const transaction = {
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    };
    transactions.push(transaction);
    init();
    updateLocalStorage();
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
});