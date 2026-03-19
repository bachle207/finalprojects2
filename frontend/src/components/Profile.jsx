import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, message, Divider, Typography, Row, Col, Tag } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onUpdateProfile = async (values) => {
    setLoading(true);
    try {
      await updateUser({
        fullName: values.fullName,
        phone: values.phone || '',
        company: values.company || '',
        avatar: values.avatar || ''
      });
      message.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      const msg = error.response?.data?.message || 'Cập nhật thất bại!';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Title level={2}>👤 Thiết lập trang cá nhân</Title>
      <Text type="secondary">Cập nhật thông tin của bạn để hiển thị trên hệ thống</Text>
      <Divider />
  
      <Row gutter={[24, 24]}>
        {/* Cột hiển thị Avatar xem trước */}
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
            <Avatar 
              size={100} 
              src={user?.avatar} 
              icon={<UserOutlined />} 
              style={{ marginBottom: 16 }}
            />
            <Title level={4} style={{ margin: 0 }}>{user?.fullName || 'Chưa đặt tên'}</Title>
            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>{user?.email}</Text>
            <Tag color="cyan" style={{ marginTop: 8 }}>{user?.role?.toUpperCase()}</Tag>
            {user?.phone && <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>📞 {user.phone}</Text>}
            {user?.company && <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>🏢 {user.company}</Text>}
          </Card>
        </Col>
  
        {/* Cột Form chỉnh sửa */}
        <Col xs={24} md={16}>
          <Card title="Chỉnh sửa thông tin" bordered={false} className="shadow-sm">
            <Form 
              layout="vertical" 
              form={form}
              initialValues={{ 
                email: user?.email, 
                fullName: user?.fullName,
                phone: user?.phone || '',
                company: user?.company || '',
                avatar: user?.avatar || ''
              }} 
              onFinish={onUpdateProfile}
            >
              <Form.Item label="Địa chỉ Email" name="email">
                <Input disabled prefix={<UserOutlined />} />
              </Form.Item>
  
              <Form.Item 
                label="Tên hiển thị" 
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng không để trống tên!' }]}
              >
                <Input placeholder="Ví dụ: Nguyễn Văn A" />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="0123456789" />
              </Form.Item>

              {user?.role === 'employer' && (
                <Form.Item label="Tên công ty" name="company">
                  <Input placeholder="Công ty ABC" />
                </Form.Item>
              )}
  
              <Form.Item label="Link ảnh đại diện (URL)" name="avatar">
                <Input placeholder="Dán link ảnh tại đây" />
              </Form.Item>
  
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" block size="large" loading={loading}>
                Lưu thay đổi
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}