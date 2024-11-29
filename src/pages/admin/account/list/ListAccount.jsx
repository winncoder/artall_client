import './ListAccount.css';
import { useState } from 'react';
import {
	Table,
	Button,
	Row,
	Col,
	Input,
	Avatar,
	Tabs,
	Dropdown,
	Menu,
	message,
} from 'antd';
import { formatDistanceToNow } from 'date-fns';
import {
	InfoCircleOutlined,
	DeleteOutlined,
	ExportOutlined,
	RollbackOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import Pagination from '../../../../components/pagination/Pagination';
import {
	useGetUsers,
	useDeleteUserInfo,
	useGetUsersDeleted,
} from '../../../../hooks/useUser';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';
import { useNavigate } from 'react-router-dom';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';

const { TabPane } = Tabs;

const ListAccounts = () => {
	useCheckAuthorization('admin');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	const [activeTab, setActiveTab] = useState('1');
	const [loading, setLoading] = useState(false);
	const [isLoadingBar, setIsLoadingBar] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const [username, setUsername] = useState('');
	const handleSearchByUsername = (value) => {
		setPaginationTab1({ page: 1, take: 15 });
		setPaginationTab2({ page: 1, take: 15 });
		setUsername(value.trim());
	};

	const [paginationTab1, setPaginationTab1] = useState({ page: 1, take: 15 });
	const [paginationTab2, setPaginationTab2] = useState({ page: 1, take: 15 });

	const paginationOptions =
		activeTab === '1'
			? { page: paginationTab1.page, take: paginationTab1.take }
			: { page: paginationTab2.page, take: paginationTab2.take };

	const {
		data: users,
		isLoading: isLoadingUsers,
		refetch: refetchUsers,
	} = useGetUsers({ ...paginationOptions, username: username });

	const { data: usersDeleted, isLoading: isLoadingUsersDeleted } =
		useGetUsersDeleted({ ...paginationOptions, username: username });

	const isLoading = isLoadingUsers || isLoadingUsersDeleted;

	const formattedData =
		users?.data?.map((item) => ({
			key: item.id,
			profilePicture: item.profilePicture || 'https://via.placeholder.com/40',
			username: item.username || 'Unknown Username',
			fullName: item.userProfile?.fullName || 'Unknown User',
			email: item.userProfile?.email || 'No Email',
			role: item.userProfile?.role || 'No Role',
			bio: item.userProfile?.bio || 'No Bio',
			gender: item.userProfile?.gender || null,
			birthDate: new Date(item.userProfile?.birthDate) || null,
			postCount: item.postCount || 0,
			followerCount: item.followerCount || 0,
			followingCount: item.followingCount || 0,
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
		})) || [];

	const dataSource =
		activeTab === '1'
			? formattedData
			: usersDeleted?.data?.map((item) => ({
					key: item.id,
					profilePicture:
						item.profilePicture || 'https://via.placeholder.com/40',
					username: item.username || 'Unknown Username',
					fullName: item.userProfile?.fullName || 'Unknown User',
					email: item.userProfile?.email || 'No Email',
					role: item.userProfile?.role || 'No Role',
					bio: item.userProfile?.bio || 'No Bio',
					gender: item.userProfile?.gender || null,
					birthDate: new Date(item.userProfile?.birthDate) || null,
					postCount: item.postCount || 0,
					followerCount: item.followerCount || 0,
					followingCount: item.followingCount || 0,
					createdAt: new Date(item.createdAt),
					updatedAt: new Date(item.updatedAt),
				})) || [];

	const { mutate: deleteUser } = useDeleteUserInfo();
	const handleDelete = (record) => {
		const userId = record.key;
		console.log('Delete user with ID:', userId);

		if (!userId) {
			message.error('User ID is not defined');
			return;
		}

		setIsLoadingBar(true);
		deleteUser(userId, {
			onSuccess: () => {
				message.success('User deleted successfully');
				setIsLoadingBar(false);
				refetchUsers();
			},
			onError: (error) => {
				console.error('Error deleting user:', error);
				message.error('Failed to delete user');
				setIsLoadingBar(false);
			},
		});
	};

	const navigate = useNavigate();
	const handleInfoClick = (record) => {
		navigate(`/admin/account/${record.key}`);
	};

	const columns = [
		{
			title: 'Avatar',
			dataIndex: 'profilePicture',
			key: 'profilePicture',
			render: (profilePicture) => (
				<Avatar shape="circle" size={40} src={profilePicture} alt="Avatar" />
			),
		},
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
			sorter: (a, b) => a.username.localeCompare(b.username),
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			filters: [
				{ text: 'Admin', value: 'admin' },
				{ text: 'User', value: 'user' },
				{ text: 'Moderator', value: 'moderator' },
			],
			onFilter: (value, record) => record.role === value,
			render: (role) => (
				<span className={`role-badge ${role.toLowerCase()}`}>
					{role.toUpperCase()}
				</span>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			filterDropdown: ({
				setSelectedKeys,
				selectedKeys,
				confirm,
				clearFilters,
			}) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Search email"
						value={selectedKeys[0]}
						onChange={(e) =>
							setSelectedKeys(e.target.value ? [e.target.value] : [])
						}
						onPressEnter={() => confirm()}
						style={{ marginBottom: 8, display: 'block' }}
					/>
					<Button
						type="primary"
						onClick={() => confirm()}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters()}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</div>
			),
			onFilter: (value, record) =>
				record.email.toLowerCase().includes(value.toLowerCase()),
			render: (email) => <div>{email}</div>,
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
			filters: [
				{ text: 'Male', value: 'male' },
				{ text: 'Female', value: 'female' },
				{ text: 'Other', value: 'other' },
			],
			onFilter: (value, record) => record.gender === value,
			render: (gender) => <span>{gender}</span>,
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date) => (
				<span>{formatDistanceToNow(date, { addSuffix: true })}</span>
			),
			sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<div style={{ display: 'flex', justifyContent: 'start', width: 120 }}>
					<Button
						type="link"
						icon={<InfoCircleOutlined />}
						onClick={() => handleInfoClick(record)}
					/>
					{activeTab === '2' && (
						<Button
							type="link"
							icon={<RollbackOutlined />}
							onClick={() => console.log(record)}
						/>
					)}
					<Button
						type="link"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDelete(record)}
					/>
				</div>
			),
		},
	];

	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const start = () => {
		setLoading(true);
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoading(false);
		}, 1000);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const hasSelected = selectedRowKeys.length > 0;

	const handleLogout = () => {
		localStorage.removeItem('access_token'); // Xóa token khỏi localStorage
		navigate('/login'); // Điều hướng về trang login
	};

	return (
		<div
			style={{
				background: '#ffffff',
				padding: 0,
				borderRadius: 8,
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
			}}
		>
			<LoadingBar isLoading={isLoadingBar} />
			<Row
				className="content-navbar"
				justify="space-between"
				align="middle"
				style={{ marginBottom: 16 }}
			>
				<Col>
					<Tabs
						className="content-tabs-nav"
						defaultActiveKey="1"
						onChange={handleTabChange}
					>
						<TabPane tab="All Users" key="1" />
						<TabPane tab="Users Deleted" key="2" />
					</Tabs>
				</Col>

				<Col style={{ display: 'flex' }}>
					<Input
						placeholder="Search"
						className="search-input"
						allowClear
						style={{ minWidth: 400 }}
						onChange={(e) => handleSearchByUsername(e.target.value)}
					/>
				</Col>

				<Col style={{ display: 'flex', height: '38px' }}>
					<Button
						className="btn-icon-admin"
						style={{ marginRight: 8 }}
						icon={<DeleteOutlined />}
						onClick={start}
						disabled={!hasSelected}
						loading={loading}
					/>
					<Button
						className="btn-icon-admin"
						style={{ marginRight: 15 }}
						icon={<ExportOutlined />}
					/>
					<Button style={{ marginRight: 15 }} className="btn-create-post">
						Create User
					</Button>

					<Dropdown
						overlay={
							<Menu>
								<Menu.Item key="1">Profile</Menu.Item>
								<Menu.Item key="2">Settings</Menu.Item>
								<Menu.Item key="3" onClick={handleLogout}>
									Logout
								</Menu.Item>
							</Menu>
						}
						placement="bottomRight"
					>
						<Avatar src={userInfo?.profilePicture} />
					</Dropdown>
				</Col>
			</Row>

			{/* Main content section */}
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<Row gutter={[24]} style={{ flex: 1 }}>
					<Col
						xs={24}
						className="table-container"
						style={{ overflowY: 'auto', flex: 1 }}
					>
						<Table
							className="content-table"
							columns={columns}
							dataSource={dataSource}
							loading={isLoading}
							bordered
							rowSelection={rowSelection}
							pagination={false}
							scroll={{ y: 500 }}
						/>
					</Col>
				</Row>

				{/* Pagination section */}
				<Row className="pagination-container" style={{ marginTop: 'auto' }}>
					<Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
						<Pagination
							items={activeTab === '1' ? users : usersDeleted}
							table={activeTab === '1' ? paginationTab1 : paginationTab2}
							setTable={
								activeTab === '1' ? setPaginationTab1 : setPaginationTab2
							}
						/>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default ListAccounts;
