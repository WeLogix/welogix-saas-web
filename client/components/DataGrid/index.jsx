import React from 'react';
import { Table } from 'antd';
import './style.less';

export default function DataGrid(props) {
  const {
    columns,
  } = props;
  return (
    <div className="welo-data-grid">
      <Table
        {...props}
        columns={columns}
        bordered
        pagination={{ ...props.pagination, size: 'small', hideOnSinglePage: true }}
      />
    </div>
  );
}
