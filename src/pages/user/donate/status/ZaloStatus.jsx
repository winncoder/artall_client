import './ZaloStatus.css';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useGetDonationStatus } from '../../../../hooks/useDonate';

function ZaloStatus() {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(15);
	const [searchParams] = useSearchParams();
	const id = searchParams.get('app_trans_id');
	const postId = searchParams.get('postId');
	const userId = searchParams.get('userId');
	const amount = searchParams.get('amount');

	// Debug để kiểm tra giá trị lấy từ URL
	console.log('Params:', { id, postId, userId, amount });

	// Lấy trạng thái giao dịch từ hook
	const {
		data: zaloStatus,
		error,
		loading,
	} = useGetDonationStatus(id, amount, userId, postId);
	console.log('Zalo status:', zaloStatus);
	const getPaymentStatus = () => {
		if (loading) return { title: 'Loading...', icon: '' };
		if (error) return { title: 'Error occurred', icon: '' };

		if (!zaloStatus) return { title: 'UNKNOWN STATUS', icon: '' };

		switch (zaloStatus?.details?.return_code) {
			case 1:
				return {
					title: 'PAYMENT SUCCESSFULLY',
					icon: 'https://clipart-library.com/images_k/success-transparent/success-transparent-3.png',
				};
			case 2:
				return {
					title: 'PAYMENT FAILED',
					icon: 'https://scdn.zalopay.com.vn/payment-gateway/images/icon-error1.svg',
				};
			case 3:
				return {
					title: 'PAYMENT NOT COMPLETED',
					icon: 'https://scdn.zalopay.com.vn/payment-gateway/images/icon-error1.svg',
				};
			default:
				return { title: 'UNKNOWN STATUS', icon: '' };
		}
	};

	const paymentStatus = getPaymentStatus();

	useEffect(() => {
		// Thiết lập đếm ngược
		const timer = setInterval(() => {
			setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		// Điều hướng tự động khi đếm ngược về 0
		if (countdown === 0) {
			console.log('Redirecting...');
			navigate(`/post/${postId}`);
		}

		return () => clearInterval(timer); // Dọn dẹp timer khi component bị hủy
	}, [countdown, navigate]);

	// Xử lý khi người dùng nhấn vào "Come back now"
	const handleBackNow = () => {
		navigate(`/post/${postId}`);
	};

	return (
		<div className="zalo-status-container">
			<div className="zalo-warning">
				<img
					src={paymentStatus.icon}
					alt="Status icon"
					className="zalo-warning-icon"
				/>
				<h2 className="zalo-title">{paymentStatus.title}</h2>

				{/* Hiển thị thông báo chi tiết nếu có */}
				{zaloStatus?.details?.return_message && (
					<p className="zalo-description">
						{zaloStatus.details.return_message}
					</p>
				)}
				<Button
					href="https://qc-support.zalopay.vn/customer/gateway/?source=payment-gateway&more-info=%7B%22appid%22%3A%220-%22%2C%22apptransid%22%3A%22%22%2C%22zptransid%22%3A0%2C%22tpecode%22%3A-54%2C%22bankcode%22%3A%22%22%7D"
					className="zalo-support-btn"
					type="primary"
				>
					Support
				</Button>
				<p className="zalo-timer">
					The system will return to the next page in{' '}
					<span className="zalo-timer-countdown">{countdown}</span> second
					{countdown !== 1 ? 's' : ''}.
				</p>
				<a
					onClick={handleBackNow}
					className="zalo-back-link"
					style={{ cursor: 'pointer' }}
				>
					Come back now
				</a>
			</div>
		</div>
	);
}

export default ZaloStatus;
