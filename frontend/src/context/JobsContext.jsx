import { createContext, useState, useEffect, useCallback } from 'react';
import { jobsAPI } from '../services/api.js';

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsAPI.getAll();
      setJobs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (jobData) => {
    setError(null);
    try {
      const newJob = await jobsAPI.create(jobData);
      setJobs(prev => [...prev, newJob]);
      return newJob;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateJob = async (id, jobData) => {
    setError(null);
    try {
      const updatedJob = await jobsAPI.update(id, jobData);
      setJobs(prev => prev.map(job => job._id === id ? updatedJob : job));
      return updatedJob;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteJob = async (id) => {
    setError(null);
    try {
      await jobsAPI.delete(id);
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const searchJobs = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsAPI.search(filters);
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      error,
      addJob,
      updateJob,
      deleteJob,
      searchJobs,
      refreshJobs: fetchJobs
    }}>
      {children}
    </JobsContext.Provider>
  );
};
