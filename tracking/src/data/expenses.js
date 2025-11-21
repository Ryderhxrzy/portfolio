/**
 * Dummy expenses data for the Expenses Tracking app
 * Contains realistic expense entries across multiple categories
 * spanning the past 3 months
 * 
 * TODO: Replace with API call to fetch expenses from backend
 */

// Generate dates for the past 3 months
const now = new Date();
const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

// Helper to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Categories for expenses
const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Personal Care'
];

// Sample descriptions for each category
const descriptions = {
  'Food & Dining': [
    'Lunch at restaurant',
    'Coffee shop',
    'Dinner with friends',
    'Fast food',
    'Food delivery',
    'Restaurant reservation'
  ],
  'Transportation': [
    'Uber ride',
    'Gas station',
    'Public transport ticket',
    'Parking fee',
    'Car maintenance',
    'Taxi fare'
  ],
  'Shopping': [
    'Clothing purchase',
    'Electronics',
    'Online shopping',
    'Bookstore',
    'Gift purchase',
    'Home decor'
  ],
  'Bills & Utilities': [
    'Electricity bill',
    'Internet subscription',
    'Phone bill',
    'Water bill',
    'Insurance payment',
    'Subscription service'
  ],
  'Entertainment': [
    'Movie tickets',
    'Concert tickets',
    'Streaming service',
    'Video game purchase',
    'Theater show',
    'Sports event'
  ],
  'Healthcare': [
    'Pharmacy',
    'Doctor visit',
    'Dental checkup',
    'Prescription medication',
    'Gym membership',
    'Vitamins & supplements'
  ],
  'Education': [
    'Online course',
    'Textbook purchase',
    'Workshop fee',
    'Software license',
    'Certification exam',
    'Training materials'
  ],
  'Travel': [
    'Hotel booking',
    'Flight ticket',
    'Travel insurance',
    'Airport parking',
    'Souvenirs',
    'Travel guide'
  ],
  'Groceries': [
    'Weekly grocery shopping',
    'Supermarket',
    'Farmers market',
    'Bulk purchase',
    'Organic food',
    'Household items'
  ],
  'Personal Care': [
    'Haircut',
    'Skincare products',
    'Cosmetics',
    'Spa treatment',
    'Beauty salon',
    'Personal hygiene items'
  ]
};

// Generate 35 realistic expense entries
const generateExpenses = () => {
  const expenses = [];
  const expenseIds = new Set();
  
  for (let i = 0; i < 35; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryDescriptions = descriptions[category];
    const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    const date = randomDate(threeMonthsAgo, now);
    
    // Generate realistic amounts based on category
    let amount;
    switch (category) {
      case 'Food & Dining':
        amount = Math.round((Math.random() * 80 + 10) * 100) / 100; // $10-$90
        break;
      case 'Transportation':
        amount = Math.round((Math.random() * 50 + 5) * 100) / 100; // $5-$55
        break;
      case 'Shopping':
        amount = Math.round((Math.random() * 200 + 20) * 100) / 100; // $20-$220
        break;
      case 'Bills & Utilities':
        amount = Math.round((Math.random() * 150 + 30) * 100) / 100; // $30-$180
        break;
      case 'Entertainment':
        amount = Math.round((Math.random() * 100 + 15) * 100) / 100; // $15-$115
        break;
      case 'Healthcare':
        amount = Math.round((Math.random() * 120 + 25) * 100) / 100; // $25-$145
        break;
      case 'Education':
        amount = Math.round((Math.random() * 300 + 50) * 100) / 100; // $50-$350
        break;
      case 'Travel':
        amount = Math.round((Math.random() * 500 + 100) * 100) / 100; // $100-$600
        break;
      case 'Groceries':
        amount = Math.round((Math.random() * 150 + 30) * 100) / 100; // $30-$180
        break;
      case 'Personal Care':
        amount = Math.round((Math.random() * 80 + 15) * 100) / 100; // $15-$95
        break;
      default:
        amount = Math.round((Math.random() * 100 + 10) * 100) / 100;
    }
    
    // Generate unique ID
    let id;
    do {
      id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } while (expenseIds.has(id));
    expenseIds.add(id);
    
    expenses.push({
      id,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      category,
      description,
      amount: parseFloat(amount.toFixed(2))
    });
  }
  
  // Sort by date (newest first)
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Export the generated expenses
export const expensesData = generateExpenses();

// Export categories for use in filters
export { categories };



