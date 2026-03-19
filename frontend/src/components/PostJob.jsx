import React, { useState } from 'react';
import { Card, Input, Select, InputNumber, Button, Row, Col, Typography, Divider, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const initialFormData = {
  title: '',
  company: '',
  city: '',
  salary: '',
  type: '',
  level: '',
  industry: '',
  experienceYears: 0,
  description: '',
  requirements: ''
};

export const PostJob = () => {
  const { user } = useAuth();
  const { addJob } = useJobs();
  const [formData, setFormData] = useState({ ...initialFormData, company: user?.company || '' });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { title, company, city, salary, type, level, industry, description, requirements } = formData;

    if (!title || !company || !city || !salary || !type || !level || !industry || !description || !requirements) {
      message.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      await addJob({
        ...formData,
        postedBy: user.email,
        status: 'active',
        postedDate: new Date().toLocaleDateString('vi-VN')
      });
      message.success('🎉 Đăng tin tuyển dụng thành công!');
      setFormData({ ...initialFormData, company: user?.company || '' });
    } catch (err) {
      message.error('Đăng tin thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Title level={2}>📝 Đăng tin tuyển dụng</Title>
      <Text type="secondary">Điền đầy đủ thông tin để đăng tin tuyển dụng mới</Text>
      <Divider />

      <Card bordered={false} style={{ borderRadius: '15px' }}>
        {/* Tiêu đề */}
        <div style={{ marginBottom: 20 }}>
          <Text strong>Tiêu đề công việc *</Text>
          <Input
            placeholder="Ví dụ: Senior Frontend Developer"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            size="large"
            style={{ marginTop: 8 }}
          />
        </div>

        {/* Công ty */}
        <div style={{ marginBottom: 20 }}>
          <Text strong>Công ty *</Text>
          <Input
            placeholder="Tên công ty"
            value={formData.company}
            onChange={(e) => updateFormData('company', e.target.value)}
            size="large"
            style={{ marginTop: 8 }}
          />
        </div>

        <Row gutter={16}>
          {/* Thành phố */}
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Thành phố *</Text>
              <Select
                placeholder="Chọn thành phố"
                style={{ width: '100%', marginTop: 8 }}
                size="large"
                value={formData.city || undefined}
                onChange={(value) => updateFormData('city', value)}
              >
                <Option value="Hà Nội">Hà Nội</Option>
                <Option value="TP.HCM">TP. Hồ Chí Minh</Option>
                <Option value="Đà Nẵng">Đà Nẵng</Option>
                <Option value="Hải Phòng">Hải Phòng</Option>
                <Option value="Cần Thơ">Cần Thơ</Option>
              </Select>
            </div>
          </Col>
          {/* Ngành nghề */}
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Ngành nghề *</Text>
              <Select
                placeholder="Chọn ngành nghề"
                style={{ width: '100%', marginTop: 8 }}
                size="large"
                value={formData.industry || undefined}
                onChange={(value) => updateFormData('industry', value)}
              >
                <Option value="IT">Công nghệ thông tin</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Finance">Tài chính</Option>
                <Option value="Sales">Kinh doanh</Option>
                <Option value="Education">Giáo dục</Option>
                <Option value="Healthcare">Y tế</Option>
                <Option value="Design">Thiết kế</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Mức lương */}
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Mức lương *</Text>
              <Input
                placeholder="Ví dụ: 15-25 triệu"
                value={formData.salary}
                onChange={(e) => updateFormData('salary', e.target.value)}
                size="large"
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
          {/* Kinh nghiệm */}
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Năm kinh nghiệm *</Text>
              <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                <InputNumber
                  min={0}
                  max={20}
                  placeholder="Số năm"
                  style={{ width: '100%' }}
                  size="large"
                  value={formData.experienceYears}
                  onChange={(value) => updateFormData('experienceYears', value || 0)}
                />
                <Button disabled size="large">năm</Button>
              </Space.Compact>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Loại hình */}
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Loại hình *</Text>
              <Select
                placeholder="Chọn loại hình"
                style={{ width: '100%', marginTop: 8 }}
                size="large"
                value={formData.type || undefined}
                onChange={(value) => updateFormData('type', value)}
              >
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Remote">Remote</Option>
                <Option value="Intern">Thực tập</Option>
              </Select>
            </div>
          </Col>
          {/* Cấp bậc */}
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Cấp bậc *</Text>
              <Select
                placeholder="Chọn cấp bậc"
                style={{ width: '100%', marginTop: 8 }}
                size="large"
                value={formData.level || undefined}
                onChange={(value) => updateFormData('level', value)}
              >
                <Option value="Intern">Thực tập sinh</Option>
                <Option value="Junior">Junior</Option>
                <Option value="Middle">Middle</Option>
                <Option value="Senior">Senior</Option>
                <Option value="Lead">Lead</Option>
              </Select>
            </div>
          </Col>
        </Row>

        {/* Mô tả */}
        <div style={{ marginBottom: 20 }}>
          <Text strong>Mô tả công việc *</Text>
          <TextArea
            rows={5}
            placeholder="Mô tả chi tiết về công việc, trách nhiệm, quyền lợi..."
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>

        {/* Yêu cầu */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>Yêu cầu ứng viên *</Text>
          <TextArea
            rows={4}
            placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
            value={formData.requirements}
            onChange={(e) => updateFormData('requirements', e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleSubmit}
          block
          size="large"
          loading={loading}
        >
          Đăng tin tuyển dụng
        </Button>
      </Card>
    </div>
  );
};
