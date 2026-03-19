import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// 1. Chỉ khởi tạo Context
export const ApplicationsContext = createContext();

// 2. Định nghĩa Provider Component
export const ApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  // Hàm lấy danh sách từ server
  const fetchApplications = useCallback(async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/applications`, {
        params: { email: user.email, role: user.role }
      });
      setApplications(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email, user?.role]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Hàm thêm đơn ứng tuyển
  const addApplication = async (applicationData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/applications`, applicationData);
      // Sau khi thêm, gọi fetch để lấy lại danh sách đã được populate jobId từ backend
      await fetchApplications(); 
      return response.data;
    } catch (err) {
      console.error('Add application error:', err);
      throw err;
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/applications/${id}`, { status });
      setApplications(prev => prev.map(app => app._id === id ? response.data : app));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <ApplicationsContext.Provider value={{ 
      applications, 
      loading, 
      error, 
      fetchApplications, 
      addApplication,
      updateApplicationStatus 
    }}>
      {children}
    </ApplicationsContext.Provider>
  );
};