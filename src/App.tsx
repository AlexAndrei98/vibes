import React, { useState } from 'react';
import { Layout, Menu, Select, Button, Input, Alert, message } from 'antd';
import { LoginOutlined, TrophyOutlined } from '@ant-design/icons';

import './App.css';

const { Header, Content } = Layout;
const { Option } = Select;

const allNames = ['Alex', 'Laz', 'Ibiyemi', 'Hermine', 'Ryan', 'Joseph', 'Nicolas', 'Vincent', 'Noah', 'Cristian', 'Malvika', 'Eric', 'Christina', 'Mason', 'Lucas', 'Sam', 'Satvik', 'Luke', 'Ellery', 'Fiona']
interface User {
  name: string;
  code: number;
  score: number;
  weeks: { week: number; count: number }[];
  actionsTaken?: { [week: number]: { [otherUserName: string]: boolean } }; // New field to track weekly actions on other users

}

const LogInPage: React.FC<{
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>,
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | undefined>>,
  usersData: User[],
  setUsersData: React.Dispatch<React.SetStateAction<User[]>>
}> = ({ setActiveComponent, setLoggedInUser, usersData }) => {
  const [enteredCode, setEnteredCode] = useState<number>();

  const handleLogin = () => {
    const foundUser = usersData.find(user => user.code === enteredCode);
    if (foundUser) {
      setLoggedInUser(foundUser);
      setActiveComponent('leaderboard');
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
const Leaderboard: React.FC<{
  loggedInUser?: User,
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | undefined>>,
  usersData: User[]
}> = ({ loggedInUser, setLoggedInUser, usersData }) => {

  function getWeekNumber(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  }

  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const currentWeek = getWeekNumber(new Date());

  const handleClick = (direction: string, targetUser: User) => {
    if (!loggedInUser) return;
    const currentWeek = getWeekNumber(new Date());
    const updatedUsersData = [...usersData];
    const loggedInUserIndex = updatedUsersData.findIndex(u => u.name === loggedInUser.name);
    const targetUserIndex = updatedUsersData.findIndex(u => u.name === targetUser.name);
    if (!updatedUsersData[loggedInUserIndex].actionsTaken) {
      updatedUsersData[loggedInUserIndex].actionsTaken = {};
    }
    // @ts-ignore: Object is possibly 'undefined'
    if (!updatedUsersData[loggedInUserIndex].actionsTaken[currentWeek]) {
      // @ts-ignore: Object is possibly 'undefined'
      updatedUsersData[loggedInUserIndex].actionsTaken[currentWeek] = {};
    }
    if (selectedActions[targetUser.name] === direction) {
      if (direction === "home") {
        updatedUsersData[targetUserIndex].score += 1;
      } else if (direction === "moon") {
        updatedUsersData[targetUserIndex].score -= 1;
      }
      // @ts-ignore: Object is possibly 'undefined'
      delete updatedUsersData[loggedInUserIndex].actionsTaken[currentWeek][targetUser.name];
      loggedInUser.weeks.find(w => w.week === currentWeek)!.count += 1;
      const updatedActions = { ...selectedActions };
      delete updatedActions[targetUser.name];
      setSelectedActions(updatedActions);
      return;
    }
    // @ts-ignore: Object is possibly 'undefined'
    if (updatedUsersData[loggedInUserIndex].actionsTaken[currentWeek][targetUser.name]) {
      message.error('You have already taken action on this user for this week.');
      return;
    }
    if (loggedInUser.weeks.find(w => w.week === currentWeek)!.count === 0) {
      message.error('You have already taken action on 5 users for this week.');
      return;
    }
    if (direction === "home") {
      updatedUsersData[targetUserIndex].score -= 1;
    } else if (direction === "moon") {
      updatedUsersData[targetUserIndex].score += 1;
    }
    // @ts-ignore: Object is possibly 'undefined'
    updatedUsersData[loggedInUserIndex].actionsTaken[currentWeek][targetUser.name] = true;
    loggedInUser.weeks.find(w => w.week === currentWeek)!.count -= 1;
    if (selectedActions[targetUser.name] === direction) {
      const updatedActions = { ...selectedActions };
      delete updatedActions[targetUser.name];
      setSelectedActions(updatedActions);
    } else {
      setSelectedActions({ ...selectedActions, [targetUser.name]: direction });
    }
  };
  const handleConfirm = () => {
    if (!loggedInUser) return;
    const currentWeek = getWeekNumber(new Date());
    let w = loggedInUser.weeks.find(w => w.week === currentWeek);
    if (w) {
      w.count -= 1;
    }
    setLoggedInUser({ ...loggedInUser });
  };

  //sort the usersData by score
  let _userData = [...usersData]
  let _sortedUserData = _userData.sort((a, b) => b.score - a.score);
  //write some code that picks a hue between red and green based on the score


  return (
    <div className='leaderboard'>
      <h2>Welcome {loggedInUser?.name}!</h2>
      {loggedInUser!.weeks.find(w => w.week === currentWeek)!.count < 0 &&
        <h2> Thank you for voting this week.</h2>}
      {loggedInUser!.weeks.find(w => w.week === currentWeek)!.count >= 0 &&
        <h2> You have {loggedInUser?.weeks.find(w => w.week === currentWeek)!.count} votes left</h2>}

      {loggedInUser!.weeks.find(w => w.week === currentWeek)!.count > -1 &&
        <div className="leaderboard-content">
          {usersData.map(user => (
            <div className="user-card" key={user.name}>
              <div className="avatar-placeholder">{user.name.charAt(0)}</div>
              <div className="user-details">
                <span>{user.name}</span>
              </div>
              <div className="action-buttons">
                <Button
                  type={selectedActions[user.name] === 'home' ? 'primary' : 'default'}
                  disabled={selectedActions[user.name] === 'moon'}
                  onClick={() => handleClick('home', user)}>Going Home</Button>
                <Button
                  type={selectedActions[user.name] === 'moon' ? 'primary' : 'default'}
                  disabled={selectedActions[user.name] === 'home'}
                  onClick={() => handleClick('moon', user)}>To The Moon</Button>
              </div>
            </div>
          ))}
          <Button type="primary"
            disabled={loggedInUser?.weeks.find(w => w.week === currentWeek)!.count != 0}
            onClick={handleConfirm}>
            Confirm</Button>
        </div>}
      {loggedInUser!.weeks.find(w => w.week === currentWeek)!.count === -1 &&
        <div>
          <h2>Leaderboard</h2>
          <div className="leaderboard-content">
            {_sortedUserData.map(user => (
              <div className="user-card" key={user.name}>
                <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                <div className="user-details">
                  <span>{user.name}</span>
                </div>
                <div className="user-details">
                  <span>Score: {user.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>}
    </div>

  );
};

const HomePage: React.FC<{
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>,
  usersData: User[],
  setUsersData: React.Dispatch<React.SetStateAction<User[]>>
}> = ({ setActiveComponent, usersData, setUsersData }) => {
  const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
  const [randomNumber, setRandomNumber] = useState<number | undefined>(undefined);

  const isNameClaimed = (name: string) => usersData.some(user => user.name === name);

  function getWeekNumber(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  }

  const handleNameSelect = (name: string) => {
    setSelectedName(name);
    const generatedNumber = Math.floor(1000 + Math.random() * 9000);  // This will generate a number between 1000 to 9999
    setRandomNumber(generatedNumber);
  }

  const handleClaim = () => {
    const currentWeek = getWeekNumber(new Date()) // getting the current date as YYYY-MM-DD
    const userIndex = usersData.findIndex(user => user.name === selectedName);

    const updatedUsersData = [...usersData];

    if (userIndex === -1) {
      updatedUsersData.push({
        name: selectedName!,
        code: randomNumber!,
        score: 0,
        weeks: [{ week: currentWeek, count: 5 }]
      });
    } else {
      updatedUsersData[userIndex].weeks.push({ week: currentWeek, count: 5 });
    }

    setUsersData(updatedUsersData);

    // Reset states after claim
    setSelectedName(undefined);
    setRandomNumber(undefined);
    setActiveComponent('login')
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


const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>();
  const [usersData, setUsersData] = useState<User[]>([]);

  const handleMenuClick = (page: string) => {
    //if page is logout the set logged in user to undefined and redirect to login
    //else setActiveComponent

    if (page === 'logout') {
      setLoggedInUser(undefined);
      setActiveComponent('login');
    }
    else {
      setActiveComponent(page);
    }
  }

  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" onClick={({ key }) => handleMenuClick(key.toString())}>
          {!loggedInUser && <Menu.Item key="homepage" icon={<TrophyOutlined />}>Homepage</Menu.Item>}
          {loggedInUser && <Menu.Item key="leaderboard" icon={<TrophyOutlined />}>Leaderboard</Menu.Item>}
          {!loggedInUser && <Menu.Item key="login" icon={<LoginOutlined />}>Log In</Menu.Item>}
          {loggedInUser && <Menu.Item key="logout" icon={<LoginOutlined />}>Log out</Menu.Item>}

        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
        {activeComponent === 'login' && <LogInPage setActiveComponent={setActiveComponent} setLoggedInUser={setLoggedInUser} usersData={usersData} setUsersData={setUsersData} />}
        {activeComponent === 'leaderboard' && <Leaderboard loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} usersData={usersData} />}
        {activeComponent === 'homepage' && <HomePage setActiveComponent={setActiveComponent} usersData={usersData} setUsersData={setUsersData} />}
      </Content>
    </Layout>
  );
}

export default App;
