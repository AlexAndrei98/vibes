import React, { useState } from 'react';
import {Input, Button, message } from 'antd';

import './App.css';

interface User {
    name: string;
    code: number;
    score: number;
    weeks: { week: number; count: number }[];
    actionsTaken?: { [week: number]: { [otherUserName: string]: boolean } };
  }
  
export const LogInPage: React.FC<{
    setActiveComponent: React.Dispatch<React.SetStateAction<string>>,
    setLoggedInUser: React.Dispatch<React.SetStateAction<User | undefined>>,
    usersData: User[],
    setUsersData: React.Dispatch<React.SetStateAction<User[]>>
  }> = ({ setActiveComponent, setLoggedInUser, usersData, setUsersData }) => {
    const [enteredCode, setEnteredCode] = useState<number>();
  
    const handleLogin = () => {
      const foundUser = usersData.find(user => user.code === enteredCode);
      if (foundUser) {
        setActiveComponent('leaderboard');
        setLoggedInUser(foundUser);
      } else {
        message.error('Invalid code. Please try again.');
      }
    };
  
    return (
      <div className='login'>
        <h2>Enter your code</h2>
        <Input
          className='input'
          type="number"
          placeholder="Enter your code"
          value={enteredCode}
          onChange={(e) => setEnteredCode(Number(e.target.value))}
        />
        <br />
        <Button type="primary" onClick={handleLogin}>Log In</Button>
      </div>
    );
  }
  
