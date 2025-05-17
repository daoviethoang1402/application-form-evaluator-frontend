'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Tạo context
export const FileContext = createContext();

// Custom hook để sử dụng context
export const useFileContext = () => useContext(FileContext);

// API client
const api = axios.create({
  baseURL: '/api',
});

// Provider component
export const FileProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [formFiles, setFormFiles] = useState([]);
  const [fileGroups, setFileGroups] = useState({
    "responses": [],
    "resume_parser": [],
    "jd_quantifier": [],
    "grader_summarizer": [],
    "decision_maker": []
  });

  // Helper function để split path
  const splitRelativePath = (path) => {
    const parts = path.split('/');
    const filename = parts.pop();
    const subpath = parts.join('/');
    return [filename, subpath];
  };

  // Fetch files
  const fetchFiles = async () => {
    try {
      const response = await api.get('/file/list/');
      const { files } = response.data;
      
      const groups = {
        "responses": [],
        "resume_parser": [],
        "jd_quantifier": [],
        "grader_summarizer": [],
        "decision_maker": []
      };

      files.forEach(file => {
        if (!file.includes('.')) return;
        
        if (file.startsWith('responses/')) {
          groups["responses"].push(file);
        } else if (file.includes('results/resume_parser/')) {
          groups["resume_parser"].push(file);
        } else if (file.includes('results/jd_quantifier/')) {
          groups["jd_quantifier"].push(file);
        } else if (file.includes('results/grader_summarizer/')) {
          groups["grader_summarizer"].push(file);
        } else if (file.includes('results/decision_maker/')) {
          groups["decision_maker"].push(file);
        }
      });

      setFileGroups(groups);
      setFormFiles(groups["responses"]);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };
  
  // File operations
  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };

  const handleDeleteFile = async (file) => {
    if (confirm(`Bạn có chắc chắn muốn xóa file ${file}?`)) {
      const [actualFilename, pathPrefix] = splitRelativePath(file);
      try {
        await api.delete('/file/delete', {
          params: {
            subpath: pathPrefix,
            filename: actualFilename,
          },
        });
        alert('✅ Xóa thành công');
        fetchFiles();
        setSelectedFile(null);
      } catch (err) {
        console.error(err);
        alert('❌ Không thể xóa file');
      }
    }
  };

  const handleUpload = (type) => {
    document.getElementById('formUpload').click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Upload thành công');
      setFormFiles([...formFiles, file.name]);
      setSelectedFile(file.name);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert('❌ Upload thất bại');
    }
  };

  const handleDownloadFile = async (file) => {
    const [actualFilename, pathPrefix] = splitRelativePath(file);
    try {
      const res = await api.get('/file/download', {
        params: {
          subpath: pathPrefix,
          filename: actualFilename,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('❌ Không thể tải file về');
    }
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Context value
  const value = {
    selectedFile,
    fileGroups,
    formFiles,
    fetchFiles,
    handleSelectFile,
    handleDeleteFile,
    handleUpload,
    handleFileChange,
    handleDownloadFile,
    splitRelativePath
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};