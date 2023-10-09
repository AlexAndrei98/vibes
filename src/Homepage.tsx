import React, { useState } from 'react';
import { Select, Button, Alert } from 'antd';

import './App.css';

interface User {
    name: string;
    code: number;
    score: number;
    weeks: { week: number; count: number }[];
    actionsTaken?: { [week: number]: { [otherUserName: string]: boolean } };
  }
  
const { Option } = Select;

const allNames = ['Alex', 'Laz', 'Ibiyemi', 'Hermine', 'Ryan', 'Joseph', 'Nicolas', 'Vincent', 'Noah', 'Cristian', 'Malvika', 'Eric', 'Christina', 'Mason', 'Lucas', 'Sam', 'Satvik', 'Luke', 'Ellery', 'Fiona'];


export const HomePage: React.FC<{
    setActiveComponent: React.Dispatch<React.SetStateAction<string>>,
    usersData: User[],
    setUsersData: React.Dispatch<React.SetStateAction<User[]>>
  }> = ({ setActiveComponent, usersData, setUsersData }) => {
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [randomNumber, setRandomNumber] = useState<number | undefined>(undefined);
  
    const isNameClaimed = (name: string) => usersData.some(user => user.name === name);
  
    const handleNameSelect = (name: string) => {
      setSelectedName(name);
      const generatedNumber = Math.floor(1000 + Math.random() * 9000);
      setRandomNumber(generatedNumber);
    }
  
    const handleClaim = () => {
      const currentWeek = getWeekNumber(new Date());
      const updatedUsersData = [...usersData];
  
      const userIndex = updatedUsersData.findIndex(user => user.name === selectedName);
      if (userIndex === -1) {
        updatedUsersData.push({
          name: selectedName!,
          code: randomNumber!,
          score: 0,
          weeks: [{ week: currentWeek, count: 2 }]
        });
      } else {
        updatedUsersData[userIndex].weeks.push({ week: currentWeek, count: 2 });
      }
  
      setUsersData(updatedUsersData);
      setSelectedName(undefined);
      setRandomNumber(undefined);
      setActiveComponent('');
    }
  
    return (
      <div className='homepage'>
        <h2>Claim your picks</h2>
        <Select
          placeholder="Select a name"
          style={{ width: 200 }}
          onChange={handleNameSelect}
        >
          {allNames.map(name =>
            <Option key={name} value={name} disabled={isNameClaimed(name)}>{name}</Option>
          )}
        </Select>
        {randomNumber && <p>Your code: {randomNumber}</p>}
        {randomNumber && <Alert message="DO NOT LOSE THIS CODE. Otherwise you cannot vote nor view the leaderboard." type="warning" />}
        <br />
        <Button type="primary" disabled={!selectedName} onClick={handleClaim}>Claim</Button>
      </div>
    );
  }