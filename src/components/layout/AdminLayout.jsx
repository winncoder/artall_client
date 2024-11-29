import { Layout, Row, Col } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSider from '../sidebar/adminSider/AdminSider';
import { useCheckAuthorization } from '../../hooks/useAuth';
import { PostProvider } from '../context/PostContext';

const { Content } = Layout;

const AdminLayout = () => {
	useCheckAuthorization('admin');
	return (
		<PostProvider>
			<Layout>
				<Row>
					<Col xs={24} lg={4}>
						<AdminSider />
					</Col>

					<Col xs={24} lg={20}>
						<Layout>
							<Content style={{ margin: '0 40px' }}>
								<div
									style={{
										padding: 0,
										minHeight: 360,
										background: '#ffffff',
										borderRadius: 30,
									}}
								>
									<Outlet />
								</div>
							</Content>
						</Layout>
					</Col>
				</Row>
			</Layout>
		</PostProvider>
	);
};

export default AdminLayout;
