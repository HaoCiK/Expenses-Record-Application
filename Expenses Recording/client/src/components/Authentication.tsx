import React, {useState} from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
}

interface Props {
    setUser: (user: User | null) => void;
}

function UserAuthentication({ setUser }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register function
  const handleRegister = (event: React.FormEvent) => {
    axios.post('http://localhost:3001/api/register', {username, password})
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        if (err.response.status === 400) {
            alert(err.response.data.message);
        } else {
            console.log(err.message);
        }
      });
  };

  // Login function
  const handleLogin = (event: React.FormEvent) => {
    axios.post('http://localhost:3001/api/login', {username, password})
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        if (err.response.status === 401) {
            alert(err.response.data.message);
        } else {
            console.log(err.message);
        }
      });
  };


  return (
    <div className='authentication'>
        <form>
        <label>
            Username: 
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
            Password:
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <div className='authenticationButton'>
            <button type="button" onClick={handleLogin}>Log in</button>
            <button type="button" onClick={handleRegister}>Register</button>
        </div>
        </form>
    </div>  
  );
}

export default UserAuthentication;
