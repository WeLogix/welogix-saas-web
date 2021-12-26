import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import ExcelUploader from 'client/components/ExcelUploader';
import { createFilename } from 'client/util/dataTransform';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';

export default function WsItemExportButton(props) {
  function handleMenuClick(ev) {
    const wsItemExportUrl = `${API_ROOTS.default}v1/cms/tradeitem/workspace/export/item`;
    const query = [];
    if (props.repoId) {
      query.push(`repoId=${props.repoId}`);
    }
    if (props.taskId) {
      query.push(`taskId=${props.taskId}`);
    }
    if (props.status) {
      query.push(`status=${props.status}`);
    }
    if (ev.key === 'unclassified') {
      query.push('unclassified=true');
    }
    const qs = query.length > 0 ? `?${query.join('&')}` : '';
    window.open(`${wsItemExportUrl}/${createFilename('workItemsExport')}.xlsx${qs}`);
  }
  function handleWorkItemImport() {
    props.onUploaded();
  }
  const exptMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="unclassified">未归类物料</Menu.Item>
      <Menu.Item key="all">全部</Menu.Item>
    </Menu>);
  return (<React.Fragment>
    <Dropdown overlay={exptMenu}>
      <Button icon="file-excel"> 导出 </Button>
    </Dropdown>
    <PrivilegeCover module="clearance" feature="compliance" action="edit">
      <ExcelUploader
        endpoint={`${API_ROOTS.default}v1/cms/tradeitem/workspace/importitem`}
        formData={{ data: JSON.stringify({ }) }}
        onUploaded={handleWorkItemImport}
      >
        <Button icon="upload">导入</Button>
      </ExcelUploader>
    </PrivilegeCover>
  </React.Fragment>);
}
