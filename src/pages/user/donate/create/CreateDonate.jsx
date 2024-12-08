import { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { usePaymentZaloPay } from '../../../../hooks/useDonate';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';
import { useNavigate } from 'react-router-dom';

function CreateDonate({
	postId,
	isCreateDonateModalOpen,
	setIsCreateDonateModalOpen,
}) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const [donateAmount, setDonateAmount] = useState('');
	const handleDonateAmountChange = (e) => {
		setDonateAmount(e.target.value);
	};
	const navigate = useNavigate();
	const { mutate: paymentZalo } = usePaymentZaloPay();

	const [isLoadingBar, setIsLoadingBar] = useState(false);

	const handleDonate = async () => {
		try {
			if (!donateAmount.trim()) {
				message.error('Please enter content');
				return;
			}
			setIsLoadingBar(true);

			// Gọi trực tiếp createPost
			const response = await new Promise((resolve, reject) => {
				paymentZalo(
					{
						postId: postId,
						userId: userId,
						amount: donateAmount,
					},
					{
						onSuccess: resolve,
						onError: reject,
					},
				);
			});

			if (response && response.data.return_code === 1) {
				message.success('Redirecting to payment page...');
				// Điều hướng tới `order_url`
				window.location.href = response.data.order_url;
			} else {
				message.error('Failed to create donation, please try again.');
			}
		} catch (error) {
			console.error(error);
			message.error('Failed to create Donate');
		} finally {
			setIsLoadingBar(false);
			setIsCreateDonateModalOpen(false);
			setDonateAmount('');
		}
	};

	const handleModalCancel = () => {
		setIsCreateDonateModalOpen(false);
	};

	return (
		<Modal
			className="upload-profile-photo-modal"
			closeIcon={false}
			visible={isCreateDonateModalOpen}
			onCancel={() => setIsCreateDonateModalOpen(false)}
			footer={null}
			style={{
				top: 150,
				padding: 0,
				backgroundColor: '#f6f6f6',
				borderRadius: '10px',
			}}
		>
			<LoadingBar isLoading={isLoadingBar} />
			<div>
				<div className="modal-navbar">
					<Button onClick={handleModalCancel} type="text">
						Cancel
					</Button>
					<div className="title-list-modal">Donate for this post</div>
					<Button
						onClick={handleDonate}
						type="text"
						style={{ fontWeight: '500', color: '#1890ff' }}
					>
						Donate
					</Button>
				</div>
				{/* Input for donation amount */}
				<div style={{ padding: '0 30px 30px 30px' }}>
					<img
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1732978391/zalo-pay.png"
						alt="Donate"
						style={{
							width: '100%',
							maxHeight: '200px',
							objectFit: 'contain',
							padding: '35px',
						}}
					/>
					<Input
						type="number"
						placeholder="Enter donation amount"
						value={donateAmount}
						onChange={handleDonateAmountChange}
						style={{ padding: '15px 10px', borderRadius: '12px' }}
					/>
				</div>
			</div>
		</Modal>
	);
}

export default CreateDonate;
