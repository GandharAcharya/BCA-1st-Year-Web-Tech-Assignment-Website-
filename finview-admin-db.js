// Minimal finview-admin-db.js for testing
window.finViewAdminDB = {
    getTransactions: () => [
        { type: 'income', amount: 50000, category: 'Salary', date: '2024-01-01' },
        { type: 'expense', amount: 15000, category: 'Rent', date: '2024-01-02' }
    ],
    getInvestments: () => [
        { name: 'NIFTY 50 Index Fund', currentValue: 100000, amountInvested: 80000, category: 'Equity' },
        { name: 'Government Bonds', currentValue: 50000, amountInvested: 50000, category: 'Debt' }
    ],
    getBudgets: () => [
        { category: 'Food', amount: 8000, spent: 5000 },
        { category: 'Transport', amount: 3000, spent: 2000 }
    ],
    getTotalIncome: () => 50000,
    getTotalExpenses: () => 25000,
    getNetWorth: () => 200000,
    getChatbotConversations: () => [],
    logChatbotConversation: (userId, message, response, trainingSystemUsed) => {
        console.log(`Logged: User: ${userId}, Training used: ${trainingSystemUsed}, Message: ${message.substring(0, 50)}...`);
    }
};