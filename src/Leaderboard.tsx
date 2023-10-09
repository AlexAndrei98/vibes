import React, { useState } from 'react';
import { Button, message } from 'antd';

interface User {
    name: string;
    code: number;
    score: number;
    weeks: { week: number; count: number }[];
    actionsTaken?: { [week: number]: { [otherUserName: string]: boolean } };
}

interface LeaderboardProps {
    loggedInUser?: User;
    setLoggedInUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    usersData: User[];
    setUsersData: React.Dispatch<React.SetStateAction<User[]>>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ loggedInUser, setLoggedInUser, usersData, setUsersData }) => {
    const getWeekNumber = (d: Date): number => {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil((((date.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
    };

    const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
    const currentWeek = getWeekNumber(new Date());

    const handleClick = (direction: string, targetUser: User) => {
        if (!loggedInUser) return;
        const currentWeek = getWeekNumber(new Date());
        const loggedInUserIndex = usersData.findIndex(u => u.name === loggedInUser.name);
        const targetUserIndex = usersData.findIndex(u => u.name === targetUser.name);
        if (!usersData[loggedInUserIndex].actionsTaken) {
            usersData[loggedInUserIndex].actionsTaken = {};
        }
        if (!usersData[loggedInUserIndex].actionsTaken[currentWeek]) {
            usersData[loggedInUserIndex].actionsTaken[currentWeek] = {};
        }
        if (selectedActions[targetUser.name] === direction) {
            if (direction === "home") {
                usersData[targetUserIndex].score += 1;
            } else if (direction === "moon") {
                usersData[targetUserIndex].score -= 1;
            }
            delete usersData[loggedInUserIndex].actionsTaken[currentWeek][targetUser.name];
            loggedInUser.weeks.find(w => w.week === currentWeek)!.count += 1;
            const updatedActions = { ...selectedActions };
            delete updatedActions[targetUser.name];
            setSelectedActions(updatedActions);
            return;
        }
        if (usersData[loggedInUserIndex].actionsTaken[currentWeek][targetUser.name]) {
            message.error('You have already taken action on this user for this week.');
            return;
        }
        if (loggedInUser.weeks.find(w => w.week === currentWeek)!.count === 0) {
            message.error('You have already taken action on 5 users for this week.');
            return;
        }
        if (direction === "home") {
            usersData[targetUserIndex].score -= 1;
        } else if (direction === "moon") {
            usersData[targetUserIndex].score += 1;
        }
        usersData[loggedInUserIndex].actionsTaken[currentWeek][targetUser.name] = true;
        loggedInUser.weeks.find(w => w.week === currentWeek)!.count -= 1;
        setSelectedActions({ ...selectedActions, [targetUser.name]: direction });
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

    return (
        <div className='leaderboard'>
            <h2>Welcome {loggedInUser?.name}!</h2>
            {loggedInUser?.weeks.find(w => w.week === currentWeek)!.count < 0 && <h2> You have no votes left</h2>}
            {loggedInUser?.weeks.find(w => w.week === currentWeek)!.count >= 0 && <h2> You have {loggedInUser?.weeks.find(w => w.week === currentWeek)!.count} votes left</h2>}
            {loggedInUser?.weeks.find(w => w.week === currentWeek)!.count > -1 &&
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
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </div>}
            {loggedInUser?.weeks.find(w => w.week === currentWeek)!.count < 0 &&
                <div className="leaderboard-content">
                    <h2>Leaderboard</h2>
                    <body>{JSON.stringify(usersData, null, 2)}</body>
                    {usersData.map(user => (
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
                </div>}
        </div>
    );
};

