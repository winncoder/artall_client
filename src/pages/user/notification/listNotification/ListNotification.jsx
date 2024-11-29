import './ListNotification.css';
import { Avatar, Spin } from 'antd';
import { useState } from 'react';

export const ListNotification = ({ isNotificationOpen }) => {
	// Dữ liệu giả cho thông báo
	const notifications = [
		{
			id: 1,
			message: 'John Doe liked your post',
			sender: 'John Doe',
			profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
			timestamp: '2 minutes ago',
			isRead: false,
		},
		{
			id: 2,
			message: 'Jane Smith commented on your photo',
			sender: 'Jane Smith',
			profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
			timestamp: '1 hour ago',
			isRead: false,
		},
		{
			id: 3,
			message: 'Michael Lee followed you',
			sender: 'Michael Lee',
			profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
			timestamp: '3 hours ago',
			isRead: true,
		},
		{
			id: 4,
			message: 'Sarah Brown sent you a message',
			sender: 'Sarah Brown',
			profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
			timestamp: 'Yesterday',
			isRead: false,
		},
	];

	const [isLoading, setIsLoading] = useState(false);

	return (
		<div
			className={`notification-user-container ${isNotificationOpen ? 'open' : ''}`}
		>
			<p className="user-title-search">Notifications</p>
			<div className="user-search-list">
				{isLoading ? (
					<div className="loading-container">
						<Spin size="large" />
					</div>
				) : notifications?.length > 0 ? (
					notifications.map((notification) => (
						<div
							className={`follower-item ${notification.isRead ? 'read' : 'unread'}`}
							key={notification.id}
						>
							<a href={`/${notification.sender}`}>
								<Avatar
									size={49}
									className="follower-avatar"
									src={notification.profilePicture}
								/>
							</a>
							<div className="follower-info">
								<a
									href={`/${notification.sender}`}
									className="follower-username"
								>
									{notification.sender}
								</a>
								<p className="notification-message">{notification.message}</p>
								<p className="notification-timestamp">
									{notification.timestamp}
								</p>
							</div>
						</div>
					))
				) : (
					<p>No notifications found</p>
				)}
			</div>
		</div>
	);
};

export default ListNotification;
