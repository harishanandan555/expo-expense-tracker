import { db } from "@/lib/db";

export const MAX_DATE_RANGE_DAYS = 365;

export const FEATURES = [
	{
		id: 1,
		feature: "Manage Transactions",
		description: "Log and organize income and expenses.",
	},
	{
		id: 2,
		feature: "Manage Categories",
		description: "Create and organize transaction categories.",
	},
	{
		id: 3,
		feature: "History with Bar Chart",
		description: "View yearly and monthly trends.",
	},
	{
		id: 4,
		feature: "Advanced Filters & CSV Export",
		description: "Filter transactions and export data.",
	},
	{
		id: 5,
		feature: "Billing & Categories Settings",
		description: "Manage billing info and categories.",
	},
	{
		id: 6,
		feature: "Date Range Filter",
		description: "Filter transactions by dates.",
	},
];

export const FAQS = [
	{
		id: "item-1",
		question: "How do I add a new transaction?",
		answer:
			"Navigate to the 'Transactions' page and click on the 'Add Transaction' button. Fill in the details such as amount, category, date, and description, then save the transaction.",
	},
	{
		id: "item-2",
		question: "Can I export my transaction history?",
		answer:
			"Yes, you can export your transaction history. Go to the 'Transactions' page, use the advanced filter to select the desired data, and click on the 'Export to CSV' button to download your transactions.",
	},
	{
		id: "item-3",
		question: "How do I change my billing information?",
		answer:
			"To update your billing information, go to the 'Settings' page and click on the 'Billing' section. Here, you can update your payment details and manage your subscription.",
	},
];






// CREATE TABLE DefaultCategory (
// 	     id TEXT PRIMARY KEY,
// 	     name TEXT NOT NULL,
// 	     icon TEXT NOT NULL,
// 	     type TEXT NOT NULL
// 	 );

// async function insertIncomeCategories() {
// 	const incomeCategories = [
// 	  { name: "Salary", icon: "💼", type: "income" },
// 	  { name: "Gifts", icon: "🎁", type: "income" },
// 	  { name: "Education Grants", icon: "🎓", type: "income" },
// 	  { name: "Bonus", icon: "💰", type: "income" },
// 	  { name: "Commission", icon: "🧾", type: "income" },
// 	  { name: "Investment Income", icon: "📈", type: "income" },
// 	  { name: "Rental Income", icon: "🏠", type: "income" },
// 	  { name: "Freelance Income", icon: "💵", type: "income" },
// 	  { name: "Tax Refund", icon: "💸", type: "income" },
// 	  { name: "Gambling Winnings", icon: "🎲", type: "income" },
// 	  { name: "Interest Income", icon: "🪙", type: "income" },
// 	  { name: "Selling Income", icon: "💹", type: "income" },
// 	  { name: "Tips", icon: "💳", type: "income" },
// 	  { name: "Side Job", icon: "🛠️", type: "income" },
// 	  { name: "Other Income", icon: "💲", type: "income" },
// 	];
  
// 	try {
// 	  const insertPromises = incomeCategories.map((category) =>
// 		db.defaultCategory.create({
// 		  data: category,
// 		})
// 	  );
  
// 	  await Promise.all(insertPromises);
// 	  console.log("Income categories inserted successfully.");
// 	} catch (error) {
// 	  console.error("Error inserting categories:", error);
// 	}
//   }
//   // Call the function to insert categories
//   insertIncomeCategories();
  
  
//   async function insertExpenseCategories() {
// 	  const expenseCategories = [
// 		{ name: "Auto & Transport", icon: "🚗", type: "expense" },
// 		{ name: "Bills & Utilities", icon: "💡", type: "expense" },
// 		{ name: "Charity", icon: "💛", type: "expense" },
// 		{ name: "Clothing & Accessories", icon: "👗", type: "expense" },
// 		{ name: "Dining & Restaurants", icon: "🍽️", type: "expense" },
// 		{ name: "Education", icon: "📚", type: "expense" },
// 		{ name: "Entertainment", icon: "🎮", type: "expense" },
// 		{ name: "Fees & Charges", icon: "🏦", type: "expense" },
// 		{ name: "Food & Groceries", icon: "🥑", type: "expense" },
// 		{ name: "Health & Fitness", icon: "🏥", type: "expense" },
// 		{ name: "Home Improvement", icon: "🛠️", type: "expense" },
// 		{ name: "Household Supplies", icon: "🧴", type: "expense" },
// 		{ name: "Insurance", icon: "🛡️", type: "expense" },
// 		{ name: "Loans", icon: "💳", type: "expense" },
// 		{ name: "Miscellaneous", icon: "🎉", type: "expense" },
// 		{ name: "Personal Care", icon: "🧖", type: "expense" },
// 		{ name: "Pet Care", icon: "🐾", type: "expense" },
// 		{ name: "Rent/Mortgage", icon: "🏠", type: "expense" },
// 		{ name: "Shopping", icon: "🛍️", type: "expense" },
// 		{ name: "Subscriptions", icon: "📺", type: "expense" },
// 		{ name: "Taxes", icon: "🧾", type: "expense" },
// 		{ name: "Travel", icon: "✈️", type: "expense" },
// 		{ name: "Utilities", icon: "🔌", type: "expense" },
// 		{ name: "Other Expenses", icon: "💲", type: "expense" }
// 	  ];
	
// 	  try {
// 		const insertPromises = expenseCategories.map((category) =>
// 		  db.defaultCategory.create({
// 			data: category,
// 		  })
// 		);
	
// 		await Promise.all(insertPromises);
// 		console.log("Expense categories inserted successfully.");
// 	  } catch (error) {
// 		console.error("Error inserting categories:", error);
// 	  }
// 	}
// 	// Call the function to insert categories
// 	insertExpenseCategories();  