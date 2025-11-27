import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion'; // Animations
import { ToastContainer, toast } from 'react-toastify'; // Notifications
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { FaMoneyBillWave, FaHamburger, FaHome, FaGamepad, FaQuestionCircle, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function Dashboard({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');

  const config = { headers: { Authorization: token } };

  // Helper: Get Icon based on Category
  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Salary': return <FaMoneyBillWave />;
      case 'Food': return <FaHamburger />;
      case 'Rent': return <FaHome />;
      case 'Entertainment': return <FaGamepad />;
      default: return <FaQuestionCircle />;
    }
  };

  useEffect(() => {
    axios.get('https://finance-api-jagan.onrender.com/api/transactions', config)
      .then(res => setTransactions(res.data.data))
      .catch(err => toast.error("Failed to load data"));
  }, [token]);

  const onSubmit = (e) => {
    e.preventDefault();
    if(!text || !amount) return toast.warning("Please fill all fields");

    const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    const newTrans = { text, amount: finalAmount, category };
    
    axios.post('https://finance-api-jagan.onrender.com/api/transactions', newTrans, config)
      .then(res => {
        setTransactions([...transactions, res.data.data]);
        setText('');
        setAmount('');
        toast.success("Transaction added successfully!");
      })
      .catch(err => toast.error("Error adding transaction"));
  };

  const deleteTransaction = (id) => {
    axios.delete(`https://finance-api-jagan.onrender.com/api/transactions/${id}`, config)
      .then(() => {
        setTransactions(transactions.filter(t => t._id !== id));
        toast.info("Transaction deleted");
      });
  };

  // Stats
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  const data = [
    { name: 'Income', value: parseFloat(income) || 0 },
    { name: 'Expense', value: parseFloat(expense) || 0 },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="header">
        <h1>FinanceFlow</h1>
        <p>Advanced Personal Ledger</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Col: Stats & List */}
        <div className="main-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="card balance-card"
          >
            <h4>TOTAL BALANCE</h4>
            <div className="balance-amount">${total}</div>
            <div className="inc-exp-row">
              <div className="stat-box">
                <h4>Income</h4>
                <p className="money plus">+${income}</p>
              </div>
              <div className="stat-box">
                <h4>Expense</h4>
                <p className="money minus">-${expense}</p>
              </div>
            </div>
          </motion.div>

          <h3 style={{color: 'white', marginBottom: '15px'}}>Recent Transactions</h3>
          <ul className="history-list">
            <AnimatePresence>
              {transactions.length === 0 ? (
                <p style={{color:'white', textAlign:'center', opacity:0.7}}>No transactions yet. Add one!</p>
              ) : (
                transactions.map((t) => (
                  <motion.li 
                    key={t._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`trans-item ${t.amount < 0 ? 'exp' : 'inc'}`}
                  >
                    <div className="trans-info">
                      <div className="icon-box">{getCategoryIcon(t.category)}</div>
                      <div className="trans-details">
                        <h4>{t.text}</h4>
                        <small>{t.category} • {new Date(t.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                    <div className="trans-info">
                      <span className={`money ${t.amount < 0 ? 'minus' : 'plus'}`} style={{fontWeight:'bold'}}>
                        {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount)}
                      </span>
                      <button onClick={() => deleteTransaction(t._id)} className="delete-action"><FaTrash /></button>
                    </div>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        </div>

        {/* Right Col: Form & Chart */}
        <div className="sidebar-col">
           {/* Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="card" 
            style={{height: '300px', display:'flex', flexDirection:'column', alignItems:'center'}}
          >
            <h3 className="form-header">Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{textAlign:'center', fontSize:'0.8rem', color:'#666'}}>
                <span style={{color: '#10b981'}}>● Income</span> &nbsp; 
                <span style={{color: '#ef4444'}}>● Expense</span>
            </div>
          </motion.div>

          {/* Add Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="form-header">Add Transaction</h3>
            <form onSubmit={onSubmit}>
              
              <div className="type-selector">
                <div 
                    className={`radio-option ${type === 'income' ? 'active inc' : ''}`} 
                    onClick={() => setType('income')}
                >
                    <FaArrowUp /> Income
                </div>
                <div 
                    className={`radio-option ${type === 'expense' ? 'active exp' : ''}`} 
                    onClick={() => setType('expense')}
                >
                    <FaArrowDown /> Expense
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <input 
                    type="text" 
                    className="custom-input" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Details..." 
                />
              </div>

              <div className="input-group">
                <label>Amount ($)</label>
                <input 
                    type="number" 
                    className="custom-input" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="0.00" 
                />
              </div>

              <div className="input-group">
                <label>Category</label>
                <select className="custom-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Food">Food & Dining</option>
                    <option value="Rent">Rent & Bills</option>
                    <option value="Salary">Salary & Income</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                </select>
              </div>

              <button 
                className="submit-btn" 
                style={{background: type === 'expense' ? 'linear-gradient(to right, #ef4444, #b91c1c)' : 'linear-gradient(to right, #10b981, #047857)'}}
              >
                Add Transaction
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;