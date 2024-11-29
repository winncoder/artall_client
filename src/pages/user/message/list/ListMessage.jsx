import React, { useState } from 'react';
import { Avatar, List, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './ListMessage.css';

const { TextArea } = Input;

function ListMessage() {
	const [message, setMessage] = useState(''); // Lưu trữ nội dung tin nhắn người dùng nhập
	const [selectedContact, setSelectedContact] = useState(null); // Lưu trữ contact đang được chọn

	const messages = [
		{
			id: 1,
			sender: 'Luong Kho',
			text: 'Ông tự share mad 🤣',
			align: 'left',
		},
		{
			id: 2,
			sender: 'You',
			text: 'về quê chơi thôi à',
			align: 'right',
		},
		{
			id: 3,
			sender: 'Luong Kho',
			text: 'Đà Lạt gần Phú Yên không nhỉ',
			align: 'left',
		},
		{
			id: 4,
			sender: 'You',
			text: 'cũng gần nha, Phú Yên, Nha Trang rồi tới Đà Lạt',
			align: 'right',
		},
		{
			id: 5,
			sender: 'Luong Kho',
			text: 'Tết ngta để quê ăn Tết',
			align: 'left',
		},
		{
			id: 6,
			sender: 'You',
			text: 'omg tưởng Tết đi thì gặp, tháng 9 thì bye bye =)))',
			align: 'right',
		},
	];

	const contacts = [
		{ id: 1, name: 'Huyền Nhi', active: '22h' },
		{ id: 2, name: 'Alien Zone 👽', active: '5m' },
		{ id: 3, name: 'Tuấn Hùng', active: '2h' },
		{ id: 4, name: 'Văn Chip 🍑', active: '3h' },
		{ id: 5, name: 'Khánh Vân', active: '8w' },
		{ id: 6, name: 'Luong Kho', active: '12w' },
	];

	const handleSendMessage = () => {
		if (message.trim() === '') {
			return; // Không gửi nếu người dùng không nhập nội dung
		}
		console.log('Message sent:', message);
		setMessage(''); // Reset nội dung sau khi gửi
	};

	const handleSelectContact = (contactId) => {
		setSelectedContact(contactId); // Cập nhật trạng thái khi người dùng chọn một contact
	};

	return (
		<div className="list-message">
			<div className="sidebar">
				<List
					itemLayout="horizontal"
					dataSource={contacts}
					renderItem={(item) => (
						<List.Item
							onClick={() => handleSelectContact(item.id)} // Khi người dùng nhấn vào item
							className={selectedContact === item.id ? 'selected-item' : ''}
						>
							<List.Item.Meta
								avatar={<Avatar style={{ height: '50px', width: '50px' }} />}
								title={item.name}
								description={`Active ${item.active} ago`}
							/>
						</List.Item>
					)}
				/>
			</div>
			<div className="chat-window">
				<div className="chat-header">
					<Avatar style={{ marginRight: '10px' }}>L</Avatar>
					<span>Luong Kho</span>
				</div>
				<div className="chat-body">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`chat-message ${
								message.align === 'right' ? 'message-right' : 'message-left'
							}`}
						>
							<span>{message.text}</span>
						</div>
					))}
				</div>
				<div className="chat-footer">
					<div
						className="chat-input"
						style={{
							display: 'flex',
							alignItems: 'center',
							border: '1px solid #dbdbdb',
							borderRadius: '50px',
							width: '100%',
						}}
					>
						<TextArea
							placeholder="Message..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSendMessage();
								}
							}}
							style={{
								flex: 1,
								border: 'none',
								outline: 'none',
								boxShadow: 'none',
								fontSize: '14px',
								borderRadius: '50px',
								padding: '10px 15px',
							}}
							autoSize={{ minRows: 1, maxRows: 6 }}
						/>
						{message.trim() !== '' && (
							<Button
								onClick={handleSendMessage}
								type="link"
								style={{
									color: '#0095f6',
									padding: 0,
									fontSize: '14px',
									fontWeight: '500',
									margin: '0 20px',
								}}
							>
								Send
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ListMessage;
