const balanceEL = document.getElementById("balance");
const incomeAmountEL = document.getElementById("income-amount");
const expenseAmountEL = document.getElementById("expense-amount");
const transactionListEL = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEL = document.getElementById("description");
const amountEL = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction)

function addTransaction (e){
    e.preventDefault();

    //get for value
    const description = descriptionEL.value.trim()
    const amount = parseFloat(amountEL.value)
   
    transactions.push({
        id:Date.now(),
        description,
        amount
    })

    localStorage.setItem("transactions",JSON.stringify(transactions))

    updateTransactionList()
    updateSummary()

    transactionFormEl.reset()
}

function updateTransactionList(){
    transactionListEL.innerHTML = ""
    const sortedTransactions = [...transactions].reverse()

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction)
        transactionListEL.appendChild(transactionEl)
    })
}

function createTransactionElement(transaction){
    const li = document.createElement("li")
    li.classList.add("transaction")
    li.classList.add(transaction.amount > 0 ? "income" : "expense")

    //todo update amount
    li.innerHTML = `
    <span>${transaction.description}</span>
    <span>${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
    `;

    return li;
}

function updateSummary(){
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions
    .filter(transaction => transaction.amount >0)
    .reduce((acc,transaction) => acc+transaction.amount,0)
    const expenses = transactions
   .filter(transaction => transaction.amount < 0)
   .reduce((acc, transaction) => acc + transaction.amount, 0);


    //update UI
    balanceEL.textContent = formatCurrency(balance);
    incomeAmountEL.textContent = formatCurrency(income);
    expenseAmountEL.textContent = formatCurrency(expenses);
}

function formatCurrency(number){
    return new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IN",
}).format(number);

}

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !==id)
    localStorage.setItem("transactions", JSON.stringify(transactions))

    updateSummary();
updateTransactionList();
}

//inital render
updateSummary();
updateTransactionList();