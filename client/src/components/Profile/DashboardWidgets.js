import React, { useEffect, useState } from 'react';
import { getProfile } from '../../services/userService';
import './Profile.css';

const DashboardWidgets = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    if (!user) return <p>Loading dashboard...</p>;

    return (
        <div className="dashboard-widgets">
            <h3>Welcome, {user.username}!</h3>
            <div className="widget">
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="widget">
                <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            {/* Add more widgets later like "Stories created" */}
        </div>
    );
};

export default DashboardWidgets;
