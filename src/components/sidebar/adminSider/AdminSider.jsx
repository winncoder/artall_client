import './AdminSider.css';
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Sider } = Layout;

export const AdminSider = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const getKeyFromPath = (path) => {
		if (path === '/admin') return '1';
		if (path.startsWith('/admin/account')) return '2';
		if (path === '/admin/post') return '3';
		return '1';
	};

	const [selectedKey, setSelectedKey] = useState(
		getKeyFromPath(location.pathname),
	);

	// useEffect(() => {
	//   setSelectedKey(getKeyFromPath(location.pathname));
	// }, [location.pathname]);

	const handleMenuClick = (e) => {
		if (e.key === '1') {
			navigate('/admin');
			setSelectedKey(e.key);
		} else if (e.key === '2') {
			navigate('/admin/account');
			setSelectedKey(e.key);
		} else if (e.key === '3') {
			navigate('/admin/post');
			setSelectedKey(e.key);
		} else if (e.key === '4') {
			localStorage.removeItem('access_token');
			navigate('/login');
		}
	};

	const items = [
		{
			key: '1',
			icon:
				selectedKey === '1' ? (
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
			label: 'Dashboard',
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
			label: 'Accounts',
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
			label: 'Posts',
		},
		{
			key: '4',
			icon:
				selectedKey === '7' ? (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1732977426/icon/logout-icon.png"
						alt="Logout"
						style={{ width: 24 }}
					/>
				) : (
					<img
						className="menu-icon"
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1732977426/icon/logout-icon.png"
						alt="Logout"
						style={{ width: 24 }}
					/>
				),
			label: 'Logout',
		},
	];

	return (
		<Layout style={{ minHeight: '100vh', display: 'flex' }}>
			<Sider
				breakpoint="lg"
				width={245}
				theme="light"
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
							'https://res.cloudinary.com/dekmn1kko/image/upload/v1726824769/artall_text_icon.png'
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
		</Layout>
	);
};

export default AdminSider;
