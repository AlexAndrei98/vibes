import React, { useState } from 'react';
import { Layout, Menu, Select, Button, Input, Alert, message } from 'antd';
import { LoginOutlined, TrophyOutlined } from '@ant-design/icons';
import { LogInPage } from './Login';
import { Leaderboard } from './Leaderboard';
import { HomePage } from './Homepage';
import './App.css';

const { Header, Content } = Layout;
const { Option } = Select;

const allNames = ['Alex', 'Laz', 'Ibiyemi', 'Hermine', 'Ryan', 'Joseph', 'Nicolas', 'Vincent', 'Noah', 'Cristian', 'Malvika', 'Eric', 'Christina', 'Mason', 'Lucas', 'Sam', 'Satvik', 'Luke', 'Ellery', 'Fiona'];

interface User {
  name: string;
  code: number;
  score: number;
  weeks: { week: number; count: number }[];
  actionsTaken?: { [week: number]: { [otherUserName: string]: boolean } };
}

const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>();
  const [usersData, setUsersData] = useState<User[]>([]);

  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" onClick={({ key }) => setActiveComponent(key.toString())}>
          <Menu.Item key="login" icon={<LoginOutlined />}>Log In</Menu.Item>
          <Menu.Item key="leaderboard" icon={<TrophyOutlined />}>Leaderboard</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
        {activeComponent === 'login' && <LogInPage setActiveComponent={setActiveComponent} setLoggedInUser={setLoggedInUser} usersData={usersData} setUsersData={setUsersData} />}
        {activeComponent === 'leaderboard' && <Leaderboard loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} usersData={usersData} setUsersData={setUsersData} />}
        {activeComponent === '' && <HomePage setActiveComponent={setActiveComponent} usersData={usersData} setUsersData={setUsersData} />}
      </Content>
    </Layout>
  );
}

// ... rest of the code for LogInPage, Leaderboard, and HomePage components (with the necessary adjustments to use usersData and setUsersData passed down as props) ...

export default App;
