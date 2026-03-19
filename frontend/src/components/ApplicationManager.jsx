import React from 'react';
import { Table, Tag, Card, Button, Typography, Space } from 'antd';
import { useApplications } from '../hooks/useApplications';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

export const ApplicationManager = () => {
  const { applications, loading } = useApplications();
  const { user } = useAuth();

  const columns = [
    {
      title: 'Ứng viên',
      dataIndex: 'candidateName',
      key: 'candidateName',
      hidden: user.role === 'candidate',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text><br/>
          <Text type="secondary" style={{fontSize: '12px'}}>{record.candidateEmail}</Text>
        </div>
      )
    },
    {
      title: 'Công việc',
      key: 'job',
      render: (_, record) => {
        const jobData = record.jobId; 
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{jobData?.title || "N/A"}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{jobData?.company}</Text>
          </Space>
        );
      }
    },
    {
      title: 'Ngày ứng tuyển',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { pending: 'orange', accepted: 'green', rejected: 'red' };
        const labels = { pending: 'Chờ duyệt', accepted: 'Đã nhận', rejected: 'Từ chối' };
        return <Tag color={colors[status]}>{labels[status] || status}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" href={record.resume} target="_blank">Xem CV</Button>
          {user.role === 'employer' && record.status === 'pending' && (
            <>
              <Button size="small" type="primary" ghost>Duyệt</Button>
              <Button size="small" danger ghost>Từ chối</Button>
            </>
          )}
        </Space>
      )
    }
  ].filter(item => !item.hidden);

  return (
    <Card title={user.role === 'employer' ? "👥 Quản lý danh sách ứng viên" : "📋 Đơn ứng tuyển của tôi"}>
      <Table 
        columns={columns} 
        dataSource={applications} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
};