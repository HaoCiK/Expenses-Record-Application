import React, {useState} from 'react';
import axios from 'axios';

interface Expense {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  isEditing: boolean;
}

interface User {
  id: number;
  username: string;
}

interface Props {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  user: User | null;
}

function ExpenseForm({expenses, setExpenses, user}: Props) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  // Create
  const addExpense = () => {
    if (user) {
      axios.post('http://localhost:3001/api/expenses', {user_id: user.id, date, description, category, amount: Number(amount)})
        .then(res => {
          setExpenses([...expenses, {...res.data, isEditing: false}]);
        })
        .catch(err => console.log(err.message));
    } else {
      console.log('User is not logged in');
    }
  };

  return (
    <div className='expenseForm'>
      <input type='date' value={date} onChange={e => setDate(e.target.value)} placeholder='Date'/>
      <input type='text' value={description} onChange={e => setDescription(e.target.value)} placeholder='Description'/>
      <input type='text' value={category} onChange={e => setCategory(e.target.value)} placeholder='Category'/>
      <input type='number' value={amount} onChange={e => setAmount(e.target.value)} placeholder='Amount(RM)'/>
      <button className='buttonAdd' onClick={addExpense}>Add Expense</button>
    </div>
  );
}

export default ExpenseForm;
