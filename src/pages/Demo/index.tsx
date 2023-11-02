import {
  fetchCreateResource,
  fetchSearchResource,
  fetchUpdateResource,
} from '@/services/rcc/manager.service';
import { Button, Form, Input, Modal, Pagination, Table, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import FormItem from 'antd/es/form/FormItem';

const Demo: React.FC = () => {
  const [searchModal, setSearchModal] = useState<RCC_API.FormSearchModal>({
    external_platform_id: 1,
  });
  const [dataSource, setDataSource] = useState<RCC_API.ManagerItemModal[]>([]);
  const [pagination, setPagination] = useState<RCC_API.PaginationModal>({
    page: 1,
    per_page: 10,
    total: 1,
  });
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const pageSizeOptions = [10, 20, 30, 50, 100];
  const [showModal, setShowModal] = useState<boolean>(false);

  const mounted = useRef(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  /**
   * @Author: draven.chen draven.chen@rccchina.com
   * @description: 搜索（数据加载）
   * @return {*}
   */
  const searchData = async () => {
    await setTableLoading(true);
    const res = await fetchSearchResource(searchModal, pagination);
    await setTableLoading(false);
    if (res) {
      setDataSource(res.list);
      setPagination({ total: res.total, page: res.page, per_page: res.per_page });
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      searchData();
    }
  });

  /**
   * @Author: draven.chen draven.chen@rccchina.com
   * @description: 分页
   * @param {number} page
   * @return {*}
   */
  const handlePageChange = async (page: number) => {
    console.log('handlePageChange');
    pagination.page = page;
    await setPagination({ ...pagination });
    searchData();
  };
  /**
   * @Author: draven.chen draven.chen@rccchina.com
   * @description: 页面大小切换
   * @param {number} pageSize
   * @return {*}
   */
  const handlePageSizeChange = async (_: number, size: number) => {
    pagination.per_page = size;
    await setPagination({ ...pagination });
  };

  const FormSearch: React.FC = () => {
    const [form] = Form.useForm();
    /**
     * @Author: draven.chen draven.chen@rccchina.com
     * @description: 点击搜索按钮
     * @param {RCC_API} values
     * @return {*}
     */
    const onFinish = async (values: RCC_API.FormSearchModal) => {
      console.log('onFinish values', values);
      await setPagination({ ...pagination, page: 1 });
      Object.assign(searchModal, values);
      await setSearchModal({
        ...searchModal,
      });
      searchData();
    };

    const onReset = () => {
      form.resetFields();
    };

    return (
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={searchModal}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item label="资源名称：" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="栏目ID：" name="external_id">
          <Input />
        </Form.Item>
        <Form.Item label="资源链接：" name="url">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" htmlType="reset" onClick={onReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const [modalTitle, setModalTitle] = useState<string>('');
  const initDialogModal = { name: '', url: '', external_id: '', external_platform_id: 1 };
  const [dialogModal, setDialogModal] = useState<RCC_API.ManagerItemModal>(initDialogModal);
  const [modalType, setModalType] = useState<'update' | 'create'>('create');
  /**
   * @Author: draven.chen draven.chen@rccchina.com
   * @description: 创建资源
   * @return {*}
   */
  async function handleCreateSource(type: 'create' | 'update', row?: RCC_API.ManagerItemModal) {
    let newTitle = '';
    await setModalType(type);
    if (type === 'create') {
      newTitle = '新增抓取资源';
    } else {
      newTitle = '修改抓取资源';
      row!.external_platform_id = 1;
      await setDialogModal(row!);
    }
    await setModalTitle(newTitle);
    setShowModal(true);
  }

  /**
   * @Author: draven.chen draven.chen@rccchina.com
   * @description: 弹窗组件
   * @return {*}
   */
  const RccManagerModal: React.FC = () => {
    const [modalForm] = Form.useForm<RCC_API.ManagerItemModal>();
    const handleOk = async () => {
      // setShowModal(false);
      await modalForm.validateFields();
      const submitData = modalForm.getFieldsValue();
      Object.assign(dialogModal, submitData);
      if (modalType === 'create') {
        const ret = await fetchCreateResource(dialogModal);
        console.log(ret);
        message.success('创建抓取资源成功');
      } else if (modalType === 'update') {
        const ret = await fetchUpdateResource(dialogModal);
        console.log(ret);
        message.success('更新抓取资源成功');
      }
      setShowModal(false);
      searchData();
    };
    const handleCancel = () => {
      setShowModal(false);
      modalForm.resetFields();
      setDialogModal(initDialogModal);
    };
    return (
      <Modal title={modalTitle} open={showModal} onCancel={handleCancel} onOk={handleOk}>
        <Form
          name="basic"
          form={modalForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={dialogModal}
        >
          <FormItem
            name="name"
            label="资源名称："
            rules={[{ required: true, message: '请输入资源名称' }]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="url"
            label="资源链接："
            rules={[{ required: true, message: '请输入资源链接' }]}
          >
            <Input />
          </FormItem>
          <FormItem name="description" label="资源描述：">
            <Input />
          </FormItem>
          <FormItem
            name="external_id"
            label="栏目ID："
            rules={[{ required: true, message: '请输入栏目ID' }]}
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>
    );
  };

  const columns: ColumnsType<RCC_API.ManagerItemModal> = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '栏目ID',
      dataIndex: 'external_id',
      key: 'external_id',
    },
    {
      title: '资源链接',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="truncate">
            <a href={text}>{text}</a>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: '操作',
      render: (row: RCC_API.ManagerItemModal) => {
        return (
          <div className="buttons-flex">
            <Button>查看</Button>
            <Button type="primary" onClick={() => handleCreateSource('update', row)}>
              修改
            </Button>
          </div>
        );
      },
    },
  ];

  const ManagerTable: React.FC = () => {
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        bordered
        pagination={false}
        loading={tableLoading}
      />
    );
  };

  const RccPagination: React.FC = () => {
    return (
      <Pagination
        size="small"
        total={pagination.total}
        showTotal={(total) => `共 ${total} 条`}
        showSizeChanger
        showQuickJumper
        pageSizeOptions={pageSizeOptions}
        current={pagination.page}
        pageSize={pagination.per_page}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    );
  };

  return (
    <div>
      <h1 className="text-red-400">招内抓取平台</h1>
      <FormSearch />
      <Button type="primary" onClick={() => handleCreateSource('create')}>
        + 新建
      </Button>
      <ManagerTable />
      <RccPagination />
      <RccManagerModal />
    </div>
  );
};

export default Demo;
