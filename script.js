// script.js 
// Get form, expense list, and total amount elements 
const expenseForm = 
	document.getElementById("expense-form"); 
const expenseList = 
	document.getElementById("expense-list"); 
const totalAmountElement = 
	document.getElementById("total-amount"); 

// Initialize expenses array from localStorage 
let expenses = 
	JSON.parse(localStorage.getItem("expenses")) || []; 

// Function to render expenses in tabular form 
function renderExpenses() { 

	// Clear expense list 
	expenseList.innerHTML = ""; 

	// Initialize total amount 
	let totalAmount = 0; 

	// Loop through expenses array and create table rows 
	for (let i = 0; i < expenses.length; i++) { 
		const expense = expenses[i]; 
		const expenseRow = document.createElement("tr"); 
		expenseRow.innerHTML = ` 
	<td>${expense.name}</td> 
	<td>$${expense.amount}</td>
	<td>${expense.date}</td> 
	<td class="delete-btn" data-id="${i}">Delete</td>	
	`; 
		expenseList.appendChild(expenseRow); 

		// Update total amount 
		totalAmount += expense.amount; 
	} 

	// Update total amount display 
	totalAmountElement.textContent = 
		totalAmount.toFixed(2); 

	// Save expenses to localStorage 
	localStorage.setItem("expenses", 
		JSON.stringify(expenses)); 
} 

// Function to add expense 
function addExpense(event) { 
	event.preventDefault(); 

	// Get expense name and amount from form 
	const expenseNameInput = 
		document.getElementById("expense-name"); 
	const expenseAmountInput = 
		document.getElementById("expense-amount");
	const expenseDateInput = 
		document.getElementById("expense-date"); 

	const expenseName = 
		expenseNameInput.value; 
	const expenseAmount = 
		parseFloat(expenseAmountInput.value); 
	const expenseDate = 
	expenseDateInput.value; // Capture the date
		
	// Clear form inputs 
	expenseNameInput.value = ""; 
	expenseAmountInput.value = ""; 

	// Validate inputs 
	if (expenseName === "" || isNaN(expenseAmount)) { 
		alert("Please enter valid expense details."); 
		return; 
	} 

	// Create new expense object 
	const expense = { 
		name: expenseName, 
		amount: expenseAmount,
		date: expenseDate 
	}; 

	// Add expense to expenses array 
	expenses.push(expense); 

	// Render expenses 
	renderExpenses(); 
} 

// Function to delete expense 
function deleteExpense(event) { 
	if (event.target.classList.contains("delete-btn")) { 

		// Get expense index from data-id attribute 
		const expenseIndex = 
			parseInt(event.target.getAttribute("data-id")); 

		// Remove expense from expenses array 
		expenses.splice(expenseIndex, 1); 

		// Render expenses 
		renderExpenses(); 
	} 
} 


// Add event listeners 
expenseForm.addEventListener("submit", addExpense); 
expenseList.addEventListener("click", deleteExpense);

// Render initial expenses on page load 
renderExpenses();
// New code starts here
// Get the "View Summary" button and the container for displaying the summary
const viewSummaryButton = document.getElementById("view-summary");
const expenseSummaryDiv = document.getElementById("expense-summary");

// Function to display the summary of expenses
function displayExpenseSummary() {
	 // Get selected start and end dates
	 const startDate = document.getElementById('start-date').value;
	 const endDate = document.getElementById('end-date').value;
 
	 // Filter expenses to only include those within the selected date range
	 const filteredExpenses = expenses.filter(expense => {
		 const expenseDate = new Date(expense.date);
		 return (!startDate || expenseDate >= new Date(startDate)) && 
				(!endDate || expenseDate <= new Date(endDate));
	 });
    // Aggregate expenses by name
    let summary = filteredExpenses.reduce((acc, curr) => {
        if (acc[curr.name]) {
            acc[curr.name] += curr.amount;
        } else {
            acc[curr.name] = curr.amount;
        }
        return acc;
    }, {});

    // Prepare data for Chart.js
    const labels = Object.keys(summary);
    const data = Object.values(summary);

    // Clear previous summary and create a canvas element for the chart
    expenseSummaryDiv.innerHTML = '<canvas id="expenseChart"></canvas>';
    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Generate the chart
    new Chart(ctx, {
        type: 'bar', // or 'pie', 'doughnut', etc., depending on your preference
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// Add event listener for the "View Summary" button
document.getElementById('filter-summary').addEventListener('click', displayExpenseSummary);
