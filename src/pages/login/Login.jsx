import { Row, Col, Typography, Input, Button } from 'antd';
import './Login.css';

const { Title } = Typography;

function LoginPage() {
	return (
		<Row
			className="Row"
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Col span={24} style={{ textAlign: 'center' }}>
				<Row className="background-image"></Row>
				<Title level={2}>Login with your account</Title>

				<Row gutter={[0, 10]} className="Row">
					<Col span={24} style={{ textAlign: 'center', marginBottom: '1px' }}>
						<Input
							id="userName"
							placeholder="Enter your Username"
							style={{
								width: '100%',
								maxWidth: '350px',
								padding: '15px',
								marginBottom: '10px',
								boxSizing: 'border-box',
								border: '1px solid #ccc',
								borderRadius: '10px',
								opacity: '0.8',
							}}
						/>
					</Col>

					<Col
						span={24}
						style={{
							textAlign: 'center',
							marginBottom: '-10px',
							marginTop: '-10px',
						}}
					>
						<Input
							type="password"
							id="password"
							placeholder="Enter your Password"
							style={{
								width: '100%',
								maxWidth: '350px',
								padding: '15px',
								marginBottom: '10px',
								boxSizing: 'border-box',
								border: '1px solid #ccc',
								borderRadius: '10px',
								opacity: '0.8',
							}}
						/>
					</Col>

					<Col
						span={24}
						style={{
							marginBottom: '2px',
							textAlign: 'center',
							position: 'relative',
						}}
					>
						<Button
							type="primary"
							style={{
								width: '100%',
								maxWidth: '350px',
								padding: '20px',
								boxSizing: 'border-box',
								backgroundColor: 'black',
								color: 'white',
								border: 'none',
								borderRadius: '10px',
								cursor: 'pointer',
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
							}}
						>
							Login
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

export default LoginPage;
