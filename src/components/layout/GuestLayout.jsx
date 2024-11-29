import { Layout, Row, Col } from 'antd';
import { Outlet } from 'react-router-dom';
import UserSider from '../sidebar/userSider/UserSider';
import { useCheckAuthorization } from '../../hooks/useAuth';

const { Content } = Layout;

const GuestLayout = () => {
	return (
		<Layout>
			<Row>
				<Col xs={24} lg={4}>
					<UserSider />
				</Col>

				<Col xs={24} lg={20}>
					<Content style={{ padding: '24px 100px' }}>
						<Outlet />
					</Content>
				</Col>
			</Row>
		</Layout>
	);
};

export default GuestLayout;
