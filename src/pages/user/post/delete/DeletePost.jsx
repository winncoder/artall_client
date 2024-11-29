import { useDeletePost } from '../../../../hooks/usePost';

// eslint-disable-next-line react/prop-types
function DeletePost({ postId, onDeleteSuccess, setLoading }) {
	const { mutate: deletePost, isError } = useDeletePost();

	const handleDeletePost = () => {
		setLoading(true); // Hiển thị thanh loading khi bắt đầu xóa
		deletePost(postId, {
			onSuccess: () => {
				onDeleteSuccess(postId); // Gọi hàm xóa thành công khi có phản hồi thành công
			},
			onError: (e) => {
				console.log(isError || e);
				setLoading(false); // Ẩn thanh loading nếu xảy ra lỗi
			},
		});
	};

	return (
		<div
			style={{
				padding: '12px 0',
				cursor: 'pointer',
				borderBottom: '1px solid #f0f0f0',
			}}
			onClick={handleDeletePost}
		>
			Delete
		</div>
	);
}

export default DeletePost;
