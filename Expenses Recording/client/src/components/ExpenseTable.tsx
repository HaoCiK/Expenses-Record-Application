import React, {useState, useEffect} from 'react';
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


function ExpenseTable({expenses, setExpenses, user}: Props) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Read
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3001/api/expenses/${user.id}`)
        .then(res => {
          const expensesMap = res.data.map((expense: Expense) => ({...expense, isEditing: false}));
          setExpenses(expensesMap);
        })
        .catch(err => console.log(err.message));
    } else {
      console.log('User is not logged in');
    }
    
  }, [user, setExpenses]);

  // Update
  const updateExpense = (id: number) => {
    if (editingExpense && user) {
      axios.put(`http://localhost:3001/api/expenses/${id}`, {user_id: user.id, ...editingExpense})
        .then(res => {
          setExpenses(expenses.map(expense => expense.id === id? {...res.data, isEditing: false} : expense));
          setEditingExpense(null);
        })
        .catch(err => console.log(err.message));
    }
  };

  //Delete
  const deleteExpense = (id: number) => {
    axios.delete(`http://localhost:3001/api/expenses/${id}`)
      .then(res => {
        setExpenses(expenses.filter(expense => expense.id !== id));
      })
      .catch(err => console.log(err.message));
  };

  // function for edit: start->edit=true, stop->edit=false
  // if edit==true, input, else display
  const startEditing = (id: number) => {
    // copy the current expense to editingExpense so that UI wont be updated
    const expense = expenses.find(expense => expense.id === id);
    if (expense) {
      setEditingExpense(expense);
      setExpenses(expenses.map(expense => expense.id === id ? {...expense, isEditing: true} : expense));
    }
  };

  const stopEditing = (id: number) => {
    setExpenses(expenses.map(expense => expense.id === id ? {...expense, isEditing: false} : expense));
    setEditingExpense(null);
  };
  

  const editInput = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (editingExpense && editingExpense.id === id) {
      setEditingExpense({...editingExpense, [event.target.name]: event.target.value});
    }
    
  };

  return (
    <div className='expenseTable'>
      <table>
        <thead>
          <tr>
            <th>Expense ID</th><th>Date</th><th>Description</th><th>Category</th><th>Amount (RM)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.id}</td>
              <td>{expense.isEditing ? <input type='date' name='date' value={editingExpense?.date} onChange={e => editInput(e, expense.id)} placeholder='Date'/> : expense.date}</td>
              <td>{expense.isEditing ? <input type='text' name='description' value={editingExpense?.description} onChange={e => editInput(e, expense.id)} placeholder='Description'/> : expense.description}</td>
              <td>{expense.isEditing ? <input type='text' name='category' value={editingExpense?.category} onChange={e => editInput(e, expense.id)} placeholder='Category'/> : expense.category}</td>
              <td>{expense.isEditing ? <input type='number' name='amount' value={editingExpense?.amount.toString()} onChange={e => editInput(e, expense.id)} placeholder='Amount (RM)'/> : expense.amount}</td>
              <td>
                {expense.isEditing ? 
                <>
                  <button className='buttonSave' onClick={() => updateExpense(expense.id)}>Save</button>
                  <button onClick={() => stopEditing(expense.id)}>Cancel</button>
                </>
                :
                <>
                  <button onClick={() => startEditing(expense.id)}>Edit</button>
                  <button className='buttonDelete' onClick={() => deleteExpense(expense.id)}>Delete</button>
                </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
