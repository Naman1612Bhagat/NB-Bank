import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, ArrowRightLeft, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [error, setError] = useState('');
  
  // Forms state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccountType, setNewAccountType] = useState('Savings');
  const [initialBalance, setInitialBalance] = useState(0);

  const [transactionType, setTransactionType] = useState(null); // 'Deposit', 'Withdraw', 'Transfer'
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [description, setDescription] = useState('');
  
  const [history, setHistory] = useState([]);
  const [viewHistoryAccount, setViewHistoryAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(res.data);
      if (res.data.length === 0) {
        setShowCreateForm(true);
      } else {
        setSelectedAccount(res.data[0].ID);
      }
    } catch (err) {
      setError('Failed to load accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/accounts/create', {
        accountType: newAccountType,
        initialBalance: Number(initialBalance)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateForm(false);
      setInitialBalance(0);
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        amount: Number(amount),
        description
      };

      if (transactionType === 'Transfer') {
        payload.fromAccountId = selectedAccount;
        payload.toAccountId = targetAccount;
      } else {
        payload.accountId = selectedAccount;
      }

      await axios.post(`http://localhost:5000/api/transactions/${transactionType.toLowerCase()}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTransactionType(null);
      setAmount('');
      setTargetAccount('');
      setDescription('');
      fetchAccounts(); // Refresh balance
      if (viewHistoryAccount === selectedAccount) {
        fetchHistory(selectedAccount);
      }
      alert(`${transactionType} successful!`);
    } catch (err) {
      setError(err.response?.data?.message || `Error during ${transactionType}`);
    }
  };

  const fetchHistory = async (accountId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/transactions/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
      setViewHistoryAccount(accountId);
    } catch (err) {
      setError('Failed to fetch history');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin h-10 w-10 text-[var(--primary-color)]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}</h1>
        {!showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
          >
            <PlusCircle size={20} /> Open New Account
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>&times;</button>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-8 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Open New Account</h2>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select 
                value={newAccountType} 
                onChange={(e) => setNewAccountType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm rounded-md"
              >
                <option value="Savings">Savings Account</option>
                <option value="Current">Current Account</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Deposit ($)</label>
              <input 
                type="number" 
                min="0" 
                value={initialBalance} 
                onChange={(e) => setInitialBalance(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-[var(--accent-color)] text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">
                Create Account
              </button>
              {accounts.length > 0 && (
                <button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Accounts List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Accounts</h2>
            {accounts.map(acc => (
              <div 
                key={acc.ID} 
                onClick={() => { setSelectedAccount(acc.ID); setTransactionType(null); fetchHistory(acc.ID); }}
                className={`p-5 rounded-xl cursor-pointer transition-all border ${selectedAccount === acc.ID ? 'border-[var(--primary-color)] bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{acc.ACCOUNT_TYPE}</span>
                  <span className="text-xs text-gray-400">Acc: {acc.ID}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">${acc.BALANCE?.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Transaction Panel */}
          {selectedAccount && (
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="flex flex-wrap gap-4 mb-6">
                  <button 
                    onClick={() => setTransactionType('Deposit')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${transactionType === 'Deposit' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <ArrowDownCircle size={18} /> Deposit
                  </button>
                  <button 
                    onClick={() => setTransactionType('Withdraw')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${transactionType === 'Withdraw' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <ArrowUpCircle size={18} /> Withdraw
                  </button>
                  <button 
                    onClick={() => setTransactionType('Transfer')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${transactionType === 'Transfer' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <ArrowRightLeft size={18} /> Transfer
                  </button>
                </div>

                {transactionType && (
                  <form onSubmit={handleTransaction} className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800">{transactionType}</h3>
                    
                    {transactionType === 'Transfer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recipient Account ID</label>
                        <input 
                          type="text" 
                          required 
                          value={targetAccount}
                          onChange={(e) => setTargetAccount(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                      <input 
                        type="number" 
                        required 
                        min="0.01" 
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                      <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="bg-[var(--primary-color)] text-white font-medium py-2 px-6 rounded-lg hover:bg-[var(--secondary-color)] transition-colors">
                        Confirm {transactionType}
                      </button>
                      <button type="button" onClick={() => setTransactionType(null)} className="text-gray-600 hover:text-gray-900 font-medium py-2 px-4">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* History Panel */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                  <button onClick={() => fetchHistory(selectedAccount)} className="text-gray-500 hover:text-[var(--primary-color)]">
                    <RefreshCw size={18} />
                  </button>
                </div>
                
                {viewHistoryAccount === selectedAccount && history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {history.map(tx => (
                          <tr key={tx.ID}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(tx.TRANSACTION_DATE).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${tx.TRANSACTION_TYPE === 'Deposit' ? 'bg-green-100 text-green-800' : 
                                  tx.TRANSACTION_TYPE === 'Withdraw' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                {tx.TRANSACTION_TYPE}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {tx.DESCRIPTION}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${tx.TRANSACTION_TYPE === 'Deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                              {tx.TRANSACTION_TYPE === 'Deposit' ? '+' : '-'}${tx.AMOUNT?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : viewHistoryAccount === selectedAccount ? (
                  <p className="text-gray-500 text-center py-8">No transactions found for this account.</p>
                ) : (
                  <p className="text-gray-500 text-center py-8">Select an account to view history.</p>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
