import './ListPProfile.css';
import { Card, Col, Row, Typography, Spin } from 'antd';
import { useState } from 'react';
import { useGetPosts } from '../../../../hooks/usePost';
import { useParams } from 'react-router-dom';
import PostModal from '../modal/PostModal';

function ListPProfile({ userId }) {
	const [table, setTable] = useState({
		page: 1,
		take: 100,
	});

	const paginationOptions = {
		page: table.page,
		take: table.take,
		userIdProfile: userId,
	};

	// Hook lấy dữ liệu bài viết và loading
	const { data: posts, loading } = useGetPosts(paginationOptions);

	const [isPostModalVisible, setIsPostModalVisible] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	return (
		<div className="post-list">
			<Row gutter={[16, 16]}>
				{loading ? (
					// Hiển thị khi đang tải
					<Col span={24} style={{ textAlign: 'center' }}>
						<Spin size="large" />
					</Col>
				) : posts?.data?.length > 0 ? (
					posts.data.map((post) => (
						<Col key={post.id} span={8}>
							<Card
								onClick={() => {
									setSelectedPost(post);
									setIsPostModalVisible(true);
								}}
								className="post-card-profile"
								hoverable
								cover={
									<div style={{ position: 'relative' }}>
										<img
											className="post-image-profile"
											alt="Post"
											src={post.mediaPath[0]} // Chỉ hiển thị ảnh đầu tiên
											style={{ width: '100%', height: 'auto' }}
										/>
										{post.mediaPath.length > 1 && (
											<div
												style={{
													position: 'absolute',
													top: 10,
													right: 10,
													borderRadius: '50%',
													padding: '5px',
												}}
											>
												<img
													src="https://res.cloudinary.com/dekmn1kko/image/upload/v1733573089/icon/muti-img.png"
													alt="Multiple images"
													style={{ width: '20px', height: '20px' }}
												/>
											</div>
										)}
									</div>
								}
							>
								{/* Có thể thêm nội dung vào đây */}
							</Card>
						</Col>
					))
				) : (
					// Hiển thị khi không có bài viết
					<Col span={24} style={{ textAlign: 'center' }}>
						<Typography.Text>No posts available</Typography.Text>
					</Col>
				)}
			</Row>
			<PostModal
				isPostDetailModalOpen={isPostModalVisible}
				setIsPostDetailModalOpen={setIsPostModalVisible}
				post={selectedPost}
			/>
		</div>
	);
}

export default ListPProfile;
