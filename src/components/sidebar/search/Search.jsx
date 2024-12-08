import './Search.css';
import { Avatar, Input, Spin } from 'antd'; // Thêm Spin từ Ant Design
import { useGetUsersInfo } from '../../../hooks/useUser';
import { useState } from 'react';

export const Search = ({ isSearchOpen }) => {
	const [table, setTable] = useState({
		page: 1,
		take: 100,
	});

	const [username, setUsername] = useState('');

	const handleSearchByUsername = (value) => {
		setUsername(value.trim());
	};

	const paginationOptions = {
		page: table.page,
		take: table.take,
		username: username || '',
	};

	const { data: users, isLoading } = useGetUsersInfo(paginationOptions);

	const filteredUsers = username ? users?.data || [] : [];

	return (
		<div className={`search-user-container ${isSearchOpen ? 'open' : ''}`}>
			<p className="user-title-search">Search</p>
			<Input
				placeholder="Search"
				className="search-input"
				allowClear
				onChange={(e) => handleSearchByUsername(e.target.value)}
			/>
			<div className="user-search-list">
				{isLoading ? (
					<div className="loading-container">
						<Spin size="large" />
					</div>
				) : filteredUsers.length > 0 ? (
					filteredUsers.map((user) => (
						<div className="follower-item" key={user.id}>
							<a href={`/profile/${user.id}`}>
								<Avatar
									size={49}
									className="follower-avatar"
									src={user.profilePicture}
								/>
							</a>
							<div className="follower-info">
								<a href={`/${user.id}`} className="follower-username">
									{user.username}
								</a>
							</div>
						</div>
					))
				) : (
					username && <p>No user matching</p>
				)}
			</div>
		</div>
	);
};

export default Search;
