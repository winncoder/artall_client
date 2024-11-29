import { Button, message } from 'antd';
import { useToggleLike } from '../../../../hooks/useLike';
import { useState } from 'react';

function ToggleLike({ postId, userId, isLiked: initialIsLiked, onLikeToggle }) {
	const { mutate: toggleLike } = useToggleLike();
	const [isLoading, setIsLoading] = useState(false);
	const [isLiked, setIsLiked] = useState(initialIsLiked);

	const handleLikeToggle = async () => {
		setIsLoading(true);
		try {
			await toggleLike({ postId, userId });
			setIsLiked(!isLiked); // Toggle the isLiked state
			onLikeToggle(postId, isLiked); // Gọi hàm từ UserHome để cập nhật số like
			message.success('Toggled successfully');
		} catch (error) {
			console.error(error);
			message.error('Failed to toggle like');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleLikeToggle}
			style={{
				marginRight: 10,
				background: 'none',
				border: 'none',
				padding: 0,
				cursor: 'pointer',
			}}
			loading={isLoading}
		>
			<img
				src={
					isLiked
						? 'https://res.cloudinary.com/dekmn1kko/image/upload/v1727255659/icon/liked-op1-icon.png'
						: 'https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/notification-icon.png'
				}
				alt="Like"
				style={{
					width: '29px',
					height: '29px',
					opacity: isLiked ? 1 : 0.8,
					transition: 'opacity 0.3s ease',
				}}
				onMouseEnter={(e) => (e.target.style.opacity = 0.5)}
				onMouseLeave={(e) => (e.target.style.opacity = isLiked ? 1 : 0.8)}
			/>
		</Button>
	);
}

export default ToggleLike;
