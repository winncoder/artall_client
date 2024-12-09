import './ListPost.css';
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
	Badge,
	message,
} from 'antd';
import { formatDistanceToNow } from 'date-fns';
import {
	InfoCircleOutlined,
	DeleteOutlined,
	ExportOutlined,
	RollbackOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import Pagination from '../../../../components/pagination/Pagination';
import {
	useGetPosts,
	useDeletePost,
	useRestorePost,
} from '../../../../hooks/usePost';
import { useGetPostsDeleted } from '../../../../hooks/usePost';
import PostDetail from '../detail/PostDetail';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const ListPosts = () => {
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

	const [isPostModalVisible, setIsPostModalVisible] = useState(false); // Quản lý trạng thái modal
	const [selectedPost, setSelectedPost] = useState(null);

	const [content, setContent] = useState('');
	const handleSearchByContent = (value) => {
		setPaginationTab1({ page: 1, take: 10 });
		setPaginationTab2({ page: 1, take: 10 });
		setContent(value.trim());
	};

	const [paginationTab1, setPaginationTab1] = useState({ page: 1, take: 10 });
	const [paginationTab2, setPaginationTab2] = useState({ page: 1, take: 10 });

	const paginationOptions =
		activeTab === '1'
			? { page: paginationTab1.page, take: paginationTab1.take }
			: { page: paginationTab2.page, take: paginationTab2.take };

	const {
		data: posts,
		isLoading: isLoadingPosts,
		refetch: refetchPosts,
	} = useGetPosts({ ...paginationOptions, content: content });

	const {
		data: postsDeleted,
		isLoading: isLoadingPostsDeleted,
		refetch: refetchPostsDeleted,
	} = useGetPostsDeleted({ ...paginationOptions, content: content });

	const isLoading = isLoadingPosts || isLoadingPostsDeleted;

	const handleReload = async () => {
		setLoading(true); // Hiển thị trạng thái loading
		try {
			await Promise.all([refetchPosts(), refetchPostsDeleted()]); // Gọi cả hai API đồng thời
		} catch (error) {
			console.error('Error reloading data:', error);
		} finally {
			setLoading(false); // Tắt trạng thái loading
		}
	};

	const formattedData =
		posts?.data?.map((item) => ({
			key: item.id,
			mediaPath: item.mediaPath || 'https://via.placeholder.com/80',
			content: item.content || 'No content available',
			likeCount: item.likeCount || 0,
			commentCount: item.commentCount || 0,
			userInfo: {
				username: item.userInfo?.username || 'No username',
				profilePicture:
					item.userInfo?.profilePicture || 'https://via.placeholder.com/40',
			},
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
		})) || [];

	const dataSource =
		activeTab === '1'
			? formattedData
			: postsDeleted?.data?.map((item) => ({
					key: item.id,
					mediaPath: item.mediaPath || 'https://via.placeholder.com/80',
					content: item.content || 'No content available',
					likeCount: item.likeCount || 0,
					commentCount: item.commentCount || 0,
					userInfo: {
						username: item.userInfo?.username || 'No username',
						profilePicture:
							item.userInfo?.profilePicture || 'https://via.placeholder.com/40',
					},
					createdAt: new Date(item.createdAt),
					updatedAt: new Date(item.updatedAt),
				})) || [];

	const handleRead = (record) => {
		setSelectedPost(record);
		setIsPostModalVisible(true);
	};

	const { mutate: deletePost } = useDeletePost();
	const handleDelete = (record) => {
		const postId = record.key;
		console.log('Delete post with ID:', postId);

		if (!postId) {
			message.error('Post ID is not defined');
			return;
		}

		setIsLoadingBar(true);
		deletePost(postId, {
			onSuccess: () => {
				message.success('Post deleted successfully');
				setIsLoadingBar(false);

				refetchPosts();
				refetchPostsDeleted();
			},
			onError: (error) => {
				console.error('Error deleting post:', error);
				message.error('Failed to delete post');
				setIsLoadingBar(false);
			},
		});
	};

	const { mutate: restorePost } = useRestorePost();
	const handleRestorePostOk = async (record) => {
		try {
			setIsLoadingBar(true);
			const postId = record.key;
			console.log('Delete post with ID:', postId);
			await new Promise((resolve, reject) => {
				restorePost(
					{ postId },
					{
						onSuccess: resolve,
						onError: reject,
					},
				);
			});

			// Sau khi tạo bài viết thành công
			message.success('Post restore successfully');
		} catch (error) {
			console.error(error);
			message.error('Failed to restore Post');
		} finally {
			setIsLoadingBar(false);
			refetchPosts();
			refetchPostsDeleted();
		}
	};

	const columns = [
		{
			title: 'Media',
			dataIndex: 'mediaPath',
			key: 'mediaPath',
			render: (mediaPath) => {
				const firstMedia =
					Array.isArray(mediaPath) && mediaPath.length > 0
						? mediaPath[0]
						: 'https://via.placeholder.com/80';
				const count = Array.isArray(mediaPath) ? mediaPath.length : 0;

				return (
					<div style={{ position: 'relative', display: 'inline-block' }}>
						<Avatar
							shape="square"
							size={80}
							src={firstMedia}
							alt="Media"
							style={{ borderRadius: 8 }}
						/>

						{count > 1 && (
							<Badge
								count={count}
								style={{
									backgroundColor: '#1890ff',
									color: '#fff',
									fontSize: '13px',
									height: '25px',
									width: '25px',
									borderRadius: '50%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'absolute',
									top: 22,
									right: -10,
								}}
							/>
						)}
					</div>
				);
			},
		},
		{
			title: 'Content',
			dataIndex: 'content',
			key: 'content',
			sorter: (a, b) => a.content.localeCompare(b.content),
			render: (text) => <div>{text}</div>,
		},
		{
			title: 'Likes',
			dataIndex: 'likeCount',
			key: 'likeCount',
			sorter: (a, b) => a.likeCount - b.likeCount,
			render: (count) => <span>{count} Likes</span>,
		},
		{
			title: 'Comments',
			dataIndex: 'commentCount',
			key: 'commentCount',
			sorter: (a, b) => a.commentCount - b.commentCount,
			render: (count) => <span>{count} Comments</span>,
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
			title: 'Updated Date',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			render: (date) => (
				<span>{formatDistanceToNow(date, { addSuffix: true })}</span>
			),
			sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
		},
		{
			title: 'User',
			dataIndex: 'userInfo',
			key: 'userInfo',
			render: (userInfo) => (
				<Avatar
					shape="circle"
					size={40}
					src={userInfo.profilePicture}
					alt="User Profile"
				/>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<div style={{ display: 'flex', justifyContent: 'start', width: 120 }}>
					<Button
						type="link"
						icon={<InfoCircleOutlined />}
						onClick={() => handleRead(record)}
					/>
					{activeTab === '2' && (
						<Button
							type="link"
							icon={<RollbackOutlined />}
							onClick={() => handleRestorePostOk(record)}
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

	const start = async () => {
		if (!hasSelected) return;

		const postIdsToDelete = selectedRowKeys;
		setLoading(true);

		try {
			if (activeTab === '2') {
				// Nếu ở tab 2, gọi hàm delete loại khác
				await deletePostTab2(postIdsToDelete);
			} else {
				// Nếu ở tab 1, sử dụng logic xóa post bình thường
				for (let postId of postIdsToDelete) {
					console.log(`Starting to delete post ${postId}`);
					await new Promise((resolve, reject) => {
						deletePost(postId, {
							onSuccess: () => {
								console.log(`Successfully deleted post ${postId}`);
								resolve(postId); // Resolve khi xóa thành công
							},
							onError: (error) => {
								console.error(`Failed to delete post ${postId}:`, error);
								reject(error); // Reject nếu gặp lỗi
							},
						});
					});
				}
			}

			message.success('Selected posts deleted successfully.');
			setSelectedRowKeys([]);
		} catch (error) {
			message.error('Failed to delete some posts. Please try again.');
		} finally {
			setLoading(false);
			refetchPosts();
			refetchPostsDeleted();
		}
	};

	const deletePostTab2 = async (postIdsToDelete) => {
		try {
			for (let postId of postIdsToDelete) {
				console.log(`Deleting post ${postId} in Tab 2 (Different logic)`);
			}
			message.success('Selected posts deleted in Tab 2.');
		} catch (error) {
			console.error('Error deleting posts in Tab 2:', error);
			message.error('Failed to delete posts in Tab 2.');
		}
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const hasSelected = selectedRowKeys.length > 0;

	const navigate = useNavigate();
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
						<TabPane tab="All Posts" key="1" />
						<TabPane tab="Posts Deleted" key="2" />
					</Tabs>
				</Col>

				<Col style={{ display: 'flex' }}>
					<Input
						placeholder="Search"
						className="search-input"
						allowClear
						style={{ minWidth: 400 }}
						onChange={(e) => handleSearchByContent(e.target.value)}
					/>
				</Col>

				<Col style={{ display: 'flex', height: '38px' }}>
					<Button
						className="btn-icon-admin"
						style={{ marginRight: 8 }}
						icon={<ReloadOutlined />}
						onClick={handleReload}
						disabled={isLoading}
						loading={loading}
					/>
					<Button
						className="btn-icon-admin"
						style={{ marginRight: 8 }}
						icon={<DeleteOutlined />}
						onClick={start}
						disabled={!hasSelected}
						loading={loading}
					/>

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
							items={activeTab === '1' ? posts : postsDeleted}
							table={activeTab === '1' ? paginationTab1 : paginationTab2}
							setTable={
								activeTab === '1' ? setPaginationTab1 : setPaginationTab2
							}
						/>
					</Col>
				</Row>

				{/* Modal for Post Detail */}
				<PostDetail
					isPostDetailModalOpen={isPostModalVisible}
					setIsPostDetailModalOpen={setIsPostModalVisible}
					post={selectedPost}
				/>
			</div>
		</div>
	);
};

export default ListPosts;
