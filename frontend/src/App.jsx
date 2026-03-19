import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography, Badge, Popover, List, notification, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { io } from "socket.io-client";
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobsProvider } from './context/JobsContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { CandidateDashboard } from './components/CandidateDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { ApplicationManager } from './components/ApplicationManager';
import { JobSearchPage } from './components/JobSearchPage';
import { CVLibrary } from './components/CVLibrary';
import { Profile } from './components/Profile';
import { ChangePassword } from './components/ChangePassword';
import { PostJob } from './components/PostJob';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('1');
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchNotis = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/${user.email}`);
        const data = await response.json();
        setNotifications(data);
      } catch (err) { console.error("Lỗi fetch noti:", err); }
    };
    if (user?.email) fetchNotis();
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);
      newSocket.emit("registerUser", user.email);
      return () => newSocket.close();
    }
  }, [user?.email]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [data, ...prev]);
        notification.success({
          message: data.title,
          description: data.message,
          placement: 'topRight',
        });
      });
    }
  }, [socket]);

  const handleMarkAllAsRead = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`http://localhost:5000/api/applications/mark-all-read/${user.email}`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => prev.map(noti => ({
          ...noti,
          isRead: true
        })));
        message.success("Đã đọc tất cả thông báo");
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const notificationContent = (
  <div style={{ width: 300 }}>
    <div style={{ 
      padding: '8px 12px', 
      borderBottom: '1px solid #f0f0f0', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }}>
      <Text strong>Thông báo</Text>
      <Button 
        type="link" 
        size="small" 
        onClick={handleMarkAllAsRead}
        disabled={!notifications.some(n => !n.isRead)}
        style={{ padding: 0 }}
      >
        Đánh dấu tất cả đã đọc
      </Button>
    </div>

    <List
      size="small"
      dataSource={notifications}
      locale={{ emptyText: 'Không có thông báo' }}
      style={{ maxHeight: 350, overflowY: 'auto' }} 
      renderItem={(item) => (
        <List.Item style={{ 
          cursor: 'pointer', 
          background: item.isRead ? '#fff' : '#f0f5ff', 
          padding: '12px',
          borderBottom: '1px solid #f5f5f5'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Text strong style={{ fontSize: '13px', color: item.isRead ? '#595959' : '#1890ff' }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: '12px' }}>{item.message}</Text>
          </div>
        </List.Item>
      )}
    />
  </div>
);

  const menuItems = {
    candidate: [
      { key: '1', label: '📊 Dashboard' },
      { key: 'search', label: '🔍 Tìm việc làm' },
      { key: 'cv_lib', label: '📄 Thư viện CV' },
      { key: '2', label: '📤 Đơn ứng tuyển' },
      { key: 'profile', label: '👤 Trang cá nhân' },
      { key: 'change_password', label: '🔒 Đổi mật khẩu' },
    ],
    employer: [
      { key: '1', label: '📈 Dashboard Tuyển dụng' },
      { key: 'post_job', label: '📝 Đăng tin' },
      { key: 'profile', label: '🏢 Hồ sơ công ty' },
      { key: 'change_password', label: '🔒 Đổi mật khẩu' },
    ]
  };

  const renderMainContent = () => {
    if (user.role === 'candidate') {
      switch (activeMenu) {
        case '1': return <CandidateDashboard />;
        case 'search': return <JobSearchPage />;
        case 'cv_lib': return <CVLibrary />;
        case '2': return <ApplicationManager />;
        case 'profile': return <Profile />;
        case 'change_password': return <ChangePassword />;
        default: return <CandidateDashboard />;
      }
    } 
    if (user.role === 'employer') {
      switch (activeMenu) {
        case '1': return <EmployerDashboard />;
        case 'post_job': return <PostJob />;
        case 'profile': return <Profile />;
        case 'change_password': return <ChangePassword />;
        default: return <EmployerDashboard />;
      }
    }
    return <div>Không có quyền truy cập</div>;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 64, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {collapsed ? '💼' : 'JOB PORTAL'}
        </div>
        <Menu theme="dark" selectedKeys={[activeMenu]} mode="inline" items={menuItems[user.role] || []} onClick={({ key }) => setActiveMenu(key)} />
      </Sider>
      
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Title level={4} style={{ margin: 0 }}>HỆ THỐNG {user.role?.toUpperCase()}</Title>
          <Space size="large">
            <Popover content={notificationContent} title="Thông báo mới" trigger="click" placement="bottomRight">
              <Badge count={notifications.filter(n => n.isRead === false).length} offset={[10, 0]}>
                <Button type="text" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
              </Badge>
            </Popover>
            <Space>
              <Avatar style={{ backgroundColor: user.role === 'employer' ? '#87d068' : '#1890ff' }}>
                {user.fullName?.charAt(0).toUpperCase()}
              </Avatar>
              <Text strong>{user.fullName}</Text>
            </Space>
            <Button type="primary" danger onClick={logout}>Đăng xuất</Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '12px' }}>
            {renderMainContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const AuthWrapper = () => {
  const { user, login, register } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  if (!user) {
    return showRegister ? (
      <RegisterForm onRegister={register} onBackToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onLogin={login} onShowRegister={() => setShowRegister(true)} />
    );
  }
  return <MainLayout />;
};

function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <ApplicationsProvider>
          <AuthWrapper />
        </ApplicationsProvider>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App; 