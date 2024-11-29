import { useEffect } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Pagination as PaginationAntd } from 'antd';

// eslint-disable-next-line react/prop-types
const Pagination = ({ items, table, setTable }) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [table]);

	const totalPages = Math.ceil(items?.meta?.itemCount / table.take);
	return (
		<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
			<PaginationAntd
				style={{
					marginRight: '3px',
				}}
				showSizeChanger={false}
				current={table.page}
				total={items?.meta?.itemCount}
				pageSize={table.take}
				itemRender={(_, type, originalElement) => {
					switch (type) {
						case 'prev':
							return <ArrowLeftOutlined />;
						case 'next':
							return <ArrowRightOutlined />;
						default:
							return originalElement;
					}
				}}
				onChange={(page) => {
					setTable({
						...table,
						page: page,
					});
				}}
				showQuickJumper={totalPages > 5}
				hideOnSinglePage={totalPages <= 1}
			/>
		</div>
	);
};

export default Pagination;
