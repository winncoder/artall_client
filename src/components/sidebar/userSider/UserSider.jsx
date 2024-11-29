import './UserSider.css';
import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import CreatePost from '../../../pages/user/post/create/CreatePost';
import { useGetUsersInfoDetal } from '../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Search from '../search/Search';
import { useLocation } from 'react-router-dom';
import ListNotification from '../../../pages/user/notification/listNotification/ListNotification';

const { Sider } = Layout;

export const UserSider = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);

	const getKeyFromPath = (path) => {
		if (path === '/') return '1';
		if (path.startsWith('/profile')) return '6';
		if (path === '/message') return '3';
		return '1';
	};

	const [selectedKey, setSelectedKey] = useState(
		getKeyFromPath(location.pathname),
	);
	const [isPostModalVisible, setIsPostModalVisible] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);

	useEffect(() => {
		setSelectedKey(getKeyFromPath(location.pathname));
	}, [location.pathname]);

	const handleMenuClick = (e) => {
		if (e.key === '1') {
			navigate('/');
			setSelectedKey(e.key);
			setIsSearchOpen(false);
			setIsNotificationOpen(false);
		} else if (e.key === '2') {
			setIsNotificationOpen(false);
			setIsSearchOpen((prev) => !prev);
			setSelectedKey(e.key);
		} else if (e.key === '3') {
			navigate('/message');
			setSelectedKey(e.key);
			setIsSearchOpen(false);
			setIsNotificationOpen(false);
		} else if (e.key === '4') {
			setIsSearchOpen(false);
			setIsNotificationOpen((prev) => !prev);
			setSelectedKey(e.key);
		} else if (e.key === '5') {
			setIsPostModalVisible(true);
			setIsSearchOpen(false);
			setIsNotificationOpen(false);
		} else if (e.key === '6') {
			navigate(`/profile/${userId}`);
			setSelectedKey(e.key);
			setIsSearchOpen(false);
			setIsNotificationOpen(false);
		} else if (e.key === '7') {
			localStorage.removeItem('access_token');
			navigate('/login');
			setIsSearchOpen(false);
			setIsNotificationOpen(false);
		}
	};

	const handleCancel = () => {
		setIsPostModalVisible(false);
	};

	const items = [
		{
			key: '1',
			icon:
				selectedKey === '1' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726854686/icon/home-selected-icon.png"
						alt="Home"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726857138/icon/home-icon.png"
						alt="Home"
						style={{ width: 24 }}
					/>
				),
			label: 'Home',
		},
		{
			key: '2',
			icon:
				selectedKey === '2' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/search-selected-icon.png"
						alt="Search"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726856760/icon/search-icon.png"
						alt="Search"
						style={{ width: 24 }}
					/>
				),
			label: 'Search',
		},
		{
			key: '3',
			icon:
				selectedKey === '3' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859748/icon/messages-selected-icon.png"
						alt="Messages"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859748/icon/messages-icon.png"
						alt="Messages"
						style={{ width: 24 }}
					/>
				),
			label: 'Messages',
		},
		{
			key: '4',
			icon:
				selectedKey === '4' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/notification-selected-icon.png"
						alt="Notifications"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/notification-icon.png"
						alt="Notifications"
						style={{ width: 24 }}
					/>
				),
			label: 'Notifications',
		},
		{
			key: '5',
			icon:
				selectedKey === '5' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/create-selected-icon.png"
						alt="Create"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/create-icon.png"
						alt="Create"
						style={{ width: 24 }}
					/>
				),
			label: 'Create',
		},
		{
			key: '6',
			icon:
				userInfo && userInfo.profilePicture ? (
					<Avatar
						className="menu-icon"
						src={userInfo.profilePicture}
						style={{ width: 24, height: 24 }}
					/>
				) : (
					<Avatar className="menu-icon" style={{ width: 24, height: 24 }} />
				),
			label: 'Profile',
		},
		{
			key: '7',
			icon:
				selectedKey === '7' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/more-selected-icon.png"
						alt="More"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/more-icon.png"
						alt="More"
						style={{ width: 24 }}
					/>
				),
			label: 'Logout',
		},
	];

	return (
		<Layout style={{ minHeight: '100vh', display: 'flex' }}>
			{/* Thanh Sider */}
			<Sider
				breakpoint="lg"
				width={245}
				theme="light"
				collapsed={isSearchOpen || isNotificationOpen}
				collapsedWidth={70}
				style={{
					position: 'fixed',
					padding: '20px 0',
					background: '#fff',
					borderRight: '1px solid #D8D8D8',
					height: 'calc(110vh - 64px)',
				}}
			>
				<div
					style={{
						margin: '10px 16px 40px 24px',
						cursor: 'pointer',
					}}
					onClick={() => (window.location.href = '/')}
				>
					<img
						src={
							isSearchOpen || isNotificationOpen
								? 'https://res.cloudinary.com/dekmn1kko/image/upload/v1726824768/artall_icon.png'
								: 'https://res.cloudinary.com/dekmn1kko/image/upload/v1726824769/artall_text_icon.png'
						}
						alt="Artall"
						style={{ height: '24px', paddingLeft: '02px' }}
					/>
				</div>
				<Menu
					className="custom-menu"
					mode="inline"
					selectedKeys={[selectedKey]}
					onClick={handleMenuClick}
					items={items}
					style={{ borderRight: 'none', flexGrow: 1 }}
				/>
			</Sider>

			{isSearchOpen && <Search isSearchOpen={isSearchOpen} />}

			{isNotificationOpen && (
				<ListNotification isNotificationOpen={isNotificationOpen} />
			)}

			{/* Modal for Create Post */}
			<CreatePost
				isCreatePostModalOpen={isPostModalVisible}
				setIsCreatePostModalOpen={handleCancel}
			/>
		</Layout>
	);
};

export default UserSider;
