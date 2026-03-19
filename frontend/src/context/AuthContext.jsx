import { createContext, useState, useContext } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Load user từ localStorage khi khởi tạo
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const login = async ({ email, password, role }) => {
        const userData = await authAPI.login({ email, password, role });
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const register = async (formData) => {
        const userData = await authAPI.register(formData);
        return userData;
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = async (newData) => {
        const updated = await authAPI.updateProfile({ 
            email: user.email, 
            ...newData 
        });
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
    };

    const changePassword = async ({ oldPassword, newPassword }) => {
        const result = await authAPI.changePassword({ 
            email: user.email, 
            oldPassword, 
            newPassword 
        });
        return result;
    };

    return (
      <AuthContext.Provider value={{ user, login, register, logout, updateUser, changePassword }}>
        {children}
      </AuthContext.Provider>
    );
};
  
export const useAuth = () => useContext(AuthContext);