import { Layout, Row, Col } from 'antd';
import { Outlet } from 'react-router-dom';
import UserSider from '../sidebar/userSider/UserSider';
import { useCheckAuthorization } from '../../hooks/useAuth';
import { PostProvider } from '../../components/context/PostContext';

const { Content } = Layout;

const UserLayout = () => {
	useCheckAuthorization('user');
	return (
		<PostProvider>
			<Layout>
				<Row>
					<Col xs={24} lg={4}>
						<UserSider />
					</Col>

					<Col xs={24} lg={20}>
						<Content>
							<Outlet />
						</Content>
					</Col>
				</Row>
			</Layout>
		</PostProvider>
	);
};

export default UserLayout;
