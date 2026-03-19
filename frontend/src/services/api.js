
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// JOB API
export const jobsAPI = {
  getAll: async () => {
    try {
      const response = await API.get('/jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await API.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  create: async (jobData) => {
    try {
      const response = await API.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  update: async (id, jobData) => {
    try {
      const response = await API.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  search: async (filters) => {
    try {
      const response = await API.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }
};

// ============ APPLICATIONS API ============
export const applicationsAPI = {
  // Lấy tất cả đơn ứng tuyển
  getAll: async () => {
    try {
      const response = await API.get('/applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Lấy đơn ứng tuyển theo ID
  getById: async (id) => {
    try {
      const response = await API.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Tạo đơn ứng tuyển mới
  create: async (applicationData) => {
    try {
      const response = await API.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn ứng tuyển
  updateStatus: async (id, status) => {
    try {
      const response = await API.put(`/applications/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Xóa đơn ứng tuyển
  delete: async (id) => {
    try {
      const response = await API.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Lấy đơn ứng tuyển theo email ứng viên
  getByEmail: async (email) => {
    try {
      const response = await API.get(`/applications?candidateEmail=${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications by email:', error);
      throw error;
    }
  },

  // Lấy đơn ứng tuyển theo job ID
  getByJobId: async (jobId) => {
    try {
      const response = await API.get(`/applications?jobId=${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications by job:', error);
      throw error;
    }
  }
};

// ============ AUTH API ============
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await API.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

// ============ USERS API (Optional) ============
export const usersAPI = {
  // Lấy tất cả users
  getAll: async () => {
    try {
      const response = await API.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Tạo user mới
  create: async (userData) => {
    try {
      const response = await API.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Tìm user theo email
  findByEmail: async (email) => {
    try {
      const response = await API.get(`/users?email=${email}`);
      const users = response.data;
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
};

export default API;