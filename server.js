const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Mock user data (in a real app, this would come from a database)
const mockUserData = {
    'user123': {
        totalIncome: 50000,
        totalExpenses: 35000,
        balance: 15000,
        categories: {
            'Food & Dining': 8500,
            'Transportation': 3200,
            'Entertainment': 2500,
            'Shopping': 5000,
            'Housing': 12000,
            'Healthcare': 1200,
            'Education': 800,
            'Bills & Utilities': 800
        },
        investments: [
            { name: 'NIFTY 50 Index Fund', amount: 100000, currentValue: 108500 },
            { name: 'Blue Chip Stocks', amount: 50000, currentValue: 52000 },
            { name: 'Debt Mutual Fund', amount: 30000, currentValue: 31500 }
        ],
        sipContributions: [
            { fund: 'NIFTY 50 Index Fund', monthlyAmount: 5000, totalContributed: 60000 },
            { fund: 'Small Cap Fund', monthlyAmount: 2000, totalContributed: 24000 }
        ],
        recentTransactions: [
            { title: 'Salary Credit', amount: 50000, type: 'income', category: 'Salary', date: '2024-01-15' },
            { title: 'Zomato Order', amount: 850, type: 'expense', category: 'Food & Dining', date: '2024-01-14' },
            { title: 'Uber Ride', amount: 320, type: 'expense', category: 'Transportation', date: '2024-01-14' }
        ]
    }
};

// AI Response Generator with structured format
function generateAIResponse(userMessage, userId = null) {
    const message = userMessage.toLowerCase();
    const userData = userId ? mockUserData[userId] : null;
    
    // Helper function to get current month expenses by category
    function getCurrentMonthExpensesByCategory(category) {
        if (!userData) return null;
        return userData.categories[category] || 0;
    }
    
    // Helper function to get total expenses this month
    function getTotalExpensesThisMonth() {
        if (!userData) return null;
        return Object.values(userData.categories).reduce((sum, amount) => sum + amount, 0);
    }
    
    // Personal finance queries (require login)
    if (userData) {
        if (message.includes('how much did i spend on') && message.includes('this month')) {
            const categoryMatch = message.match(/on (.*?) this month/);
            if (categoryMatch) {
                const category = categoryMatch[1].trim();
                const categoryMap = {
                    'food': 'Food & Dining',
                    'food and dining': 'Food & Dining',
                    'transportation': 'Transportation',
                    'entertainment': 'Entertainment',
                    'shopping': 'Shopping',
                    'housing': 'Housing',
                    'healthcare': 'Healthcare',
                    'education': 'Education',
                    'bills': 'Bills & Utilities',
                    'utilities': 'Bills & Utilities'
                };
                
                const mappedCategory = categoryMap[category.toLowerCase()] || category;
                const amount = getCurrentMonthExpensesByCategory(mappedCategory);
                
                if (amount !== null) {
                    return {
                        summary: `You spent ₹${amount.toLocaleString()} on ${mappedCategory} this month.`,
                        details: `This represents ${((amount / getTotalExpensesThisMonth()) * 100).toFixed(1)}% of your total monthly expenses.`,
                        actionableInsight: [
                            "• Compare this to previous months to identify spending trends",
                            "• Set a monthly budget limit for this category if needed"
                        ]
                    };
                }
            }
        }
        
        if (message.includes('balance') && (message.includes('low') || message.includes('why'))) {
            return {
                summary: `Your current balance is ₹${userData.balance.toLocaleString()}.`,
                details: `With total monthly expenses of ₹${getTotalExpensesThisMonth().toLocaleString()} against income of ₹${userData.totalIncome.toLocaleString()}, you have a savings rate of ${(((userData.totalIncome - getTotalExpensesThisMonth()) / userData.totalIncome) * 100).toFixed(1)}%.`,
                actionableInsight: [
                    "• Consider reducing discretionary spending in high-expense categories",
                    "• Look for ways to increase income or optimize recurring expenses"
                ]
            };
        }
        
        if (message.includes('total expense') || message.includes('total spending')) {
            return {
                summary: `Your total expenses this month are ₹${getTotalExpensesThisMonth().toLocaleString()}.`,
                details: `Your highest expense category is Food & Dining at ₹${userData.categories['Food & Dining'].toLocaleString()}.`,
                actionableInsight: [
                    "• Track this monthly to identify spending patterns",
                    "• Set budget alerts for categories where you want to reduce spending"
                ]
            };
        }
    }
    
    // Investment and general finance queries
    if (message.includes('sip') || message.includes('systematic')) {
        return {
            summary: "SIP is an excellent strategy for disciplined investing.",
            details: "SIP helps with rupee-cost averaging, removing the need to time the market. Even ₹500/month can grow significantly over time through the power of compounding.",
            actionableInsight: [
                "• Start with an amount you can consistently invest monthly",
                "• Choose funds based on your risk tolerance and investment horizon"
            ]
        };
    }
    
    if (message.includes('should i start sip') || message.includes('lump sum')) {
        return {
            summary: "Both SIP and lump sum have their advantages depending on market conditions.",
            details: "SIP reduces timing risk and is better for volatile markets. Lump sum can be beneficial in consistently rising markets or when you have a large amount to invest.",
            actionableInsight: [
                "• Use SIP for regular income and market volatility",
                "• Consider lump sum for bonus amounts or windfalls"
            ]
        };
    }
    
    if (message.includes('portfolio') && message.includes('low risk')) {
        return {
            summary: "For low-risk investors, focus on capital preservation with moderate growth.",
            details: "A conservative portfolio typically includes 70-80% in debt instruments (bonds, FDs) and 20-30% in large-cap equities or balanced funds.",
            actionableInsight: [
                "• Allocate 40% to debt mutual funds and government bonds",
                "• Keep 30% in fixed deposits and 30% in large-cap index funds"
            ]
        };
    }
    
    if (message.includes('mutual fund') || message.includes('mf')) {
        // Special case for simple explanation
        if (message.includes('like') && (message.includes('15') || message.includes('teen'))) {
            return {
                summary: "Mutual funds are like a team effort for your money!",
                details: "Imagine you and your friends pool money together to buy different toys. A mutual fund works similarly - many people put money together to buy different stocks and bonds. A professional manager decides what to buy, so you don't have to pick individual stocks yourself. It's like having an expert shop for you!",
                actionableInsight: [
                    "• Start with small amounts to learn how they work",
                    "• Choose funds that match your goals",
                    "• Be patient - investing is a long-term game"
                ]
            };
        }
        
        return {
            summary: "Mutual funds are excellent for diversification!",
            details: "For beginners, I recommend starting with index funds or balanced funds. They offer professional management and instant diversification. Select your risk tolerance on the right, and I'll show you specific mutual fund recommendations tailored to your profile.",
            actionableInsight: [
                "• Start with index funds for broad market exposure",
                "• Consider balanced funds for moderate risk",
                "• Check expense ratios before investing"
            ]
        };
    }
    
    if (message.includes('what is finview') || message.includes('budget tracker')) {
        return {
            summary: "FinView is a comprehensive financial management platform.",
            details: "FinView helps you track income and expenses, analyze spending patterns, set budgets, and get AI-powered investment advice. It provides insights into your financial health and helps you make better money decisions.",
            actionableInsight: [
                "• Use the Budget Tracker to monitor daily expenses",
                "• Check Investment Analytics for portfolio performance"
            ]
        };
    }
    
    if (message.includes('tax planning')) {
        return {
            summary: "Tax planning helps reduce your tax liability legally.",
            details: "Under Section 80C, you can save up to ₹1.5 lakhs through ELSS, PPF, life insurance, etc. Section 80D provides deductions for health insurance premiums.",
            actionableInsight: [
                "• Consider ELSS mutual funds for tax saving with growth potential",
                "• Maximize 80C limit with a mix of PPF, ELSS, and life insurance"
            ]
        };
    }
    
    if (message.includes('emi planning')) {
        return {
            summary: "EMI planning ensures your loan repayments don't strain your finances.",
            details: "The 50-30-20 rule suggests keeping total EMIs under 50% of monthly income. Consider the loan tenure, interest rate, and your monthly budget before taking new loans.",
            actionableInsight: [
                "• Keep total EMIs below 40% of monthly income",
                "• Consider prepaying high-interest loans when possible"
            ]
        };
    }
    
    if (message.includes('savings optimization')) {
        return {
            summary: "Optimize savings by balancing liquidity, returns, and risk.",
            details: "Maintain an emergency fund (6-12 months expenses) in liquid instruments. Invest surplus in higher-return instruments based on your time horizon and risk tolerance.",
            actionableInsight: [
                "• Keep 3-6 months expenses in high-yield savings accounts",
                "• Invest remaining surplus in diversified mutual funds"
            ]
        };
    }
    
    // Default structured response
    return {
        summary: "I'm here to help with your financial questions!",
        details: "I can assist with investment advice, budget planning, tax optimization, and portfolio management. Feel free to ask about specific financial topics or your personal finances.",
        actionableInsight: [
            "• Ask about specific investment options or market trends",
            "• Inquire about optimizing your budget and savings"
        ]
    };
}

// API Routes
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Generate AI response
        const aiResponse = generateAIResponse(message, userId);
        
        // Format the response as a structured message
        let formattedReply = '';
        if (typeof aiResponse === 'object') {
            formattedReply = `**${aiResponse.summary}**

${aiResponse.details}

**Actionable Insight**
${aiResponse.actionableInsight.join('\n')}`;
        } else {
            formattedReply = aiResponse;
        }
        
        res.json({ 
            reply: formattedReply,
            structured: typeof aiResponse === 'object' ? aiResponse : null
        });
        
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            reply: 'I apologize, but I encountered an error processing your request. Please try again.'
        });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'FinView AI Chat API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FinView AI Server running on http://localhost:${PORT}`);
    console.log(`📡 Chat API endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;