import { useState } from 'react';
import { Modal, Input, Button } from 'antd';

function CreateDonate({
	postId,
	isCreateDonateModalOpen,
	setIsCreateDonateModalOpen,
}) {
	const [donateAmount, setDonateAmount] = useState('');

	const handleDonate = () => {
		if (!donateAmount || parseFloat(donateAmount) <= 0) {
			alert('Please enter a valid donation amount!');
			return;
		}

		// Logic to handle donation submission
		console.log(`Donated ${donateAmount} for postId: ${postId}`);

		// Close modal after donating
		setIsCreateDonateModalOpen(false);
		setDonateAmount('');
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
						src="https://res.cloudinary.com/dekmn1kko/image/upload/v1732563012/coin.png"
						alt="Donate"
						style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
					/>
					<Input
						type="number"
						placeholder="Enter donation amount"
						value={donateAmount}
						onChange={(e) => setDonateAmount(e.target.value)}
						style={{ padding: '15px 10px', borderRadius: '12px' }}
					/>
				</div>
			</div>
		</Modal>
	);
}

export default CreateDonate;
