import React, { useState } from 'react';
import { Card, Table, Button, Tag, Input, Select, Slider, InputNumber, Row, Col, Typography, Modal, message } from 'antd';
import { Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useJobs } from '../hooks/useJobs';
import { useApplications } from '../hooks/useApplications';
import { useAuth } from '../hooks/useAuth';

const { Text, Title } = Typography;
const { Option } = Select;

export const JobSearchPage = () => {
  const { jobs, loading } = useJobs();
  const { addApplication } = useApplications();
  const { user } = useAuth();

  // Các State của bộ lọc
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCity, setFilterCity] = useState(null);
  const [filterIndustry, setFilterIndustry] = useState(null);
  const [minSalary, setMinSalary] = useState(0);
  const [yearsExperience, setYearsExperience] = useState(0);

  // Hàm xóa bộ lọc
  const handleClearFilters = () => {
    setSearchKeyword('');
    setFilterCity(null);
    setFilterIndustry(null);
    setMinSalary(0);
    setYearsExperience(0);
  };

  // Hàm phân tách mức lương từ chuỗi (VD: "25-35 triệu" -> 25)
  const parseSalary = (salaryString) => {
    if (!salaryString) return 0;
    const match = salaryString.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  // Logic lọc dữ liệu tổng hợp
  const filteredJobs = jobs.filter(job => {
    const matchKeyword = !searchKeyword ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.requirements.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchCity = !filterCity || job.city === filterCity;
    const matchIndustry = !filterIndustry || job.industry === filterIndustry;
    const matchSalary = parseSalary(job.salary) >= minSalary;
    const matchExperience = (job.experienceYears || 0) >= yearsExperience;

    return matchKeyword && matchCity && matchIndustry && matchSalary && matchExperience;
  });
  const handleQuickApply = (job) => {
    Modal.confirm({
      title: `Ứng tuyển vào vị trí ${job.title}`,
      content: 'Bạn có chắc chắn muốn ứng tuyển với hồ sơ mặc định không?',
      onOk: async () => {
        try {
          await addApplication({
            jobId: job._id,
            candidateName: user.fullName,
            candidateEmail: user.email,
            status: 'pending',
            resume: 'https://drive.google.com/your-default-cv.pdf' // CV mặc định
          });
          message.success('Đã gửi đơn ứng tuyển thành công!');
        } catch (err) {
          message.error('Gửi đơn ứng tuyển thất bại! Vui lòng thử lại.');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Công việc & Công ty',
      key: 'job',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1890ff', fontSize: '15px' }}>{record.title}</Text>
          <br />
          <Text type="secondary">{record.company}</Text>
          <br />
          <Tag color="blue" style={{ marginTop: 5 }}>{record.industry}</Tag>
        </div>
      )
    },
    {
      title: 'Yêu cầu kĩ năng',
      dataIndex: 'requirements',
      key: 'requirements',
      width: '30%',
      render: (text) => <Text italic style={{ fontSize: '13px' }}>{text}</Text>
    },
    {
      title: 'Thông tin chi tiết',
      key: 'details',
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ color: '#52c41a' }}>💰 {record.salary}</Text>
          <Text>📍 {record.city}</Text>
          <Text>⏳ KN: {record.experienceYears}+ năm</Text>
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        // <Button type="primary" onClick={() => Modal.info({ title: 'Tính năng ứng tuyển', content: 'Đang kết nối...' })}>
        //   Ứng tuyển
        // </Button>
        <Button type="primary" onClick={() => handleQuickApply(record)}>Ứng tuyển ngay</Button>
      )
    }
  ];

  return (
    <div>
      <Card title={<span><FilterOutlined /> Bộ lọc tìm kiếm nâng cao</span>} style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]}>
          {/* Tìm kiếm từ khóa */}
          <Col xs={24} md={12}>
            <Text strong>Tìm kiếm nhanh:</Text>
            <Input
              placeholder="Vị trí, kĩ năng, công ty..."
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              allowClear
            />
          </Col>

          {/* Lọc Thành phố */}
          <Col xs={12} md={6}>
            <Text strong>Thành phố:</Text>
            <Select style={{ width: '100%' }} placeholder="Tất cả" value={filterCity} onChange={setFilterCity} allowClear>
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="TP.HCM">TP. Hồ Chí Minh</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
            </Select>
          </Col>

          {/* Lọc Ngành nghề */}
          <Col xs={12} md={6}>
            <Text strong>Ngành nghề:</Text>
            <Select style={{ width: '100%' }} placeholder="Tất cả" value={filterIndustry} onChange={setFilterIndustry} allowClear>
              <Option value="IT">Công nghệ thông tin</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Finance">Tài chính</Option>
            </Select>
          </Col>

          {/* Lọc Lương */}
          <Col xs={24} md={12}>
            <Text strong>Mức lương tối thiểu: <Text type="success">{minSalary} triệu</Text></Text>
            <Slider min={0} max={100} step={5} value={minSalary} onChange={setMinSalary} />
          </Col>

          {/* Lọc Kinh nghiệm */}
          <Col xs={12} md={6}>
            <Text strong>Kinh nghiệm tối thiểu:</Text>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber min={0} max={20} value={yearsExperience} onChange={setYearsExperience} style={{ width: '100%' }} />
              <Input value="năm" disabled style={{ width: '50px' }} />
            </Space.Compact>
          </Col>

          {/* Nút Xóa bộ lọc */}
          <Col xs={12} md={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button icon={<ReloadOutlined />} onClick={handleClearFilters} block>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredJobs}
        loading={loading}
        rowKey={(record) => record._id || record.id}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};