import './AdminDashboard.css';
import {
	FallOutlined,
	ProjectOutlined,
	RiseOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Card,
	Col,
	Row,
	Select,
	Space,
	Spin,
	Avatar,
	Dropdown,
	Menu,
	Button,
} from 'antd';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useGetUserTotal, useGetUserDemographics } from '../../hooks/useUser';
import { useGetPostTotal } from '../../hooks/usePost';
import { ExportOutlined } from '@ant-design/icons';
import { useCheckAuthorization } from '../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AdminDashboard = () => {
	useCheckAuthorization('admin');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);
	const [selectedPeriod, setSelectedPeriod] = useState('year');
	console.log('Selected Period:', selectedPeriod);

	const handlePeriodChange = (value) => {
		setSelectedPeriod(value);
	};

	const { data: userTotal } = useGetUserTotal({
		period: selectedPeriod,
	});
	const { data: postTotal } = useGetPostTotal({
		period: selectedPeriod,
	});
	const { data: userCountJoin } = useGetUserTotal({
		period: 'count_join',
	});
	console.log('User Count Join:', userCountJoin);
	const { data: postCountJoin } = useGetPostTotal({
		period: 'count_join',
	});
	console.log('Post Count Join:', postCountJoin);

	// Dữ liệu động cho biểu đồ
	// Lấy dữ liệu từ joinCounts
	const formattedUserData = Object.values(userCountJoin?.joinCounts || []);
	console.log('Formatted User Data:', formattedUserData);

	const formattedPostData = Object.values(postCountJoin?.joinCounts || []);
	console.log('Formatted Post Data:', formattedPostData);

	// Tạo danh sách các tháng
	const formattedCategories = Object.keys(userCountJoin?.joinCounts || {}).map(
		(month) => `2023-${String(month).padStart(2, '0')}-01`,
	);
	console.log('Formatted Categories:', formattedCategories);

	const { data: userDemographics } = useGetUserDemographics();
	console.log('User Demographics:', userDemographics);

	// Chuyển đổi dữ liệu từ hook `useUserDemographics` cho biểu đồ
	const pyramidSeries = [
		{
			name: 'Males',
			data: userDemographics?.demographics.map((group) => group.maleCount || 0),
		},
		{
			name: 'Females',
			data: userDemographics?.demographics.map(
				(group) => -(group.femaleCount || 0), // Dữ liệu nữ âm để hiển thị đối xứng
			),
		},
	];

	const pyramidCategories = userDemographics?.demographics.map(
		(group) => group.ageGroup,
	);

	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem('access_token'); // Xóa token khỏi localStorage
		navigate('/login'); // Điều hướng về trang login
	};

	return (
		<>
			{postTotal ? (
				<div className="dashboard-container">
					<Row
						className="content-navbar"
						justify="space-between"
						align="middle"
						style={{ marginBottom: 16 }}
					>
						<Col style={{ display: 'flex' }}>
							<h1 className="edit-profile-title">Dashboard</h1>
						</Col>
						<Col style={{ display: 'flex', height: '38px' }}>
							<Button
								className="btn-icon-admin"
								style={{ marginRight: 15 }}
								icon={<ExportOutlined />}
							/>
							<Row justify="end">
								<Select
									defaultValue={selectedPeriod}
									onChange={handlePeriodChange}
									style={{
										width: 120,
										marginRight: 10,
										height: 38,
										borderRadius: 10,
									}}
								>
									<Option value="year">Year</Option>
									<Option value="month">Month</Option>
								</Select>
							</Row>

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

					{/* Biểu đồ và card */}
					<Row gutter={16}>
						<Col span={16}>
							<Card className="chart-card">
								<h2>User and Post Activity</h2>
								<ReactApexChart
									options={{
										chart: { height: 350, type: 'area' },
										dataLabels: { enabled: false },
										stroke: { curve: 'smooth' },
										xaxis: {
											type: 'datetime',
											categories: formattedCategories,
										},
										tooltip: { x: { format: 'dd/MM/yy' } },
									}}
									series={[
										{ name: 'Post', data: formattedPostData },
										{ name: 'User', data: formattedUserData },
									]}
									type="area"
									height={350}
								/>
							</Card>
						</Col>

						<Col span={8}>
							<Card className="stat-card">
								<div className="card-header">
									<ProjectOutlined className="stat-icon" />
									<h1>{postTotal?.currentCount}</h1>
									<strong>Post</strong>
								</div>
								<Space className="percentage-change">
									{postTotal?.percentagePostChange > 0 ? (
										<RiseOutlined className="percentage-icon green" />
									) : (
										<FallOutlined className="percentage-icon red" />
									)}
									<h5>{postTotal?.percentagePostChange.toFixed()}%</h5>
								</Space>
							</Card>
							<Card className="stat-card" style={{ marginTop: 16 }}>
								<div className="card-header">
									<UserOutlined className="stat-icon" />
									<h1>{userTotal?.currentCount}</h1>
									<strong>User</strong>
								</div>
								<Space className="percentage-change">
									{userTotal?.percentageUserChange > 0 ? (
										<RiseOutlined className="percentage-icon green" />
									) : (
										<FallOutlined className="percentage-icon red" />
									)}
									<h5>{userTotal?.percentageUserChange.toFixed()}%</h5>
								</Space>
							</Card>
						</Col>
					</Row>

					<Row gutter={16} style={{ marginTop: '20px' }}>
						<Col span={24}>
							<Card className="chart-card">
								<h2>Population Pyramid</h2>
								<ReactApexChart
									options={{
										chart: {
											type: 'bar',
											height: 440,
											stacked: true,
										},
										colors: ['#008FFB', '#FF4560'],
										plotOptions: {
											bar: {
												horizontal: true,
												barHeight: '80%',
												borderRadius: 5,
											},
										},
										dataLabels: {
											enabled: false,
										},
										stroke: {
											width: 1,
											colors: ['#fff'],
										},
										xaxis: {
											categories: pyramidCategories || [],
											title: {
												text: 'Population',
											},
											labels: {
												formatter: (val) => Math.abs(val).toString(),
											},
										},
										tooltip: {
											shared: false,
											x: {
												formatter: (val) => val,
											},
											y: {
												formatter: (val) => `${Math.abs(val)} individuals`,
											},
										},
									}}
									series={pyramidSeries}
									type="bar"
									height={440}
								/>
							</Card>
						</Col>
					</Row>
				</div>
			) : (
				<div className="loading-spinner">
					<Spin size="large" />
				</div>
			)}
		</>
	);
};

export default AdminDashboard;
