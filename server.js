const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/accountsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const accountSchema = new mongoose.Schema({
    name: String,
    balance: Number,
});

const Account = mongoose.model('Account', accountSchema);

// Add account
app.post('/accounts', async (req, res) => {
    const { name, balance } = req.body;
    const newAccount = new Account({ name, balance });
    await newAccount.save();
    res.json({ message: 'Account added successfully' });
});

// Get all accounts
app.get('/accounts', async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
});

// Query account balance
app.get('/accounts/:name', async (req, res) => {
    const account = await Account.findOne({ name: req.params.name });
    if (account) {
        res.json({ balance: account.balance });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});

// Delete account
app.delete('/accounts/:name', async (req, res) => {
    await Account.deleteOne({ name: req.params.name });
    res.json({ message: 'Account deleted successfully' });
});

// Export accounts as JSON
app.get('/export', async (req, res) => {
    const accounts = await Account.find();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=accounts.json');
    res.send(JSON.stringify(accounts, null, 2));
});

app.listen(5000, () => console.log('Server running on port 5000'));
