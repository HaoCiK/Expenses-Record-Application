import React, {useState} from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import Header from './Header';
import Authentication from './Authentication'
import '../styles/App.css';

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

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return (
      <div className="App">
        <Header/>
        <Authentication setUser={setUser}/>
      </div> 
    );
  } else {
    return (
      <div className="App">
        <Header/>
        <ExpenseForm
          expenses={expenses}
          setExpenses={setExpenses}
          user={user}
        />
        <ExpenseTable
          expenses={expenses}
          setExpenses={setExpenses}
          user={user}
        />
      </div>
    );
  }
  
}

export default App;
