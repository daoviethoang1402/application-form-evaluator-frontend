'use client';
import { act, useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: '/api',
});

export default function JDPage() {
  // const [cvFiles, setCvFiles] = useState(['cv_1.pdf', 'cv_2.pdf']);
  const [formFiles, setFormFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cvInput, setCvInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [columns, setColumns] = useState([]);

  const [fileGroups, setFileGroups] = useState({
    "uploads": [],
    "resume_parser": [],
    "jd_quantifier": [],
    "grader_summarizer": [],
    "decision_maker": []
  });

  const splitRelativePath = (path) => {
    // Extract filename from path by splitting at the last '/'
    const parts = path.split('/');
    const filename = parts.pop(); // Lấy phần cuối cùng
    const subpath = parts.join('/'); // Lấy phần còn lại
    return [ filename, subpath ];
  }

  const fetchFiles = async () => {
    try {
      const response = await api.get('/file/list/');
      const { files } = response.data;
      
      // Organize files into groups
      const groups = {
        "uploads": [],
        "resume_parser": [],
        "jd_quantifier": [],
        "grader_summarizer": [],
        "decision_maker": []
      };

      files.forEach(file => {
        // Only process actual files (not directories)
        if (!file.includes('.')) return;
        
        if (file.startsWith('uploads/')) {
          groups["uploads"].push(file);
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
      
      // Update form files for consistency with rest of the app
      setFormFiles(groups["uploads"]);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

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

  const handleSelectFile = async (file) => {
    setSelectedFile(file);
    console.log('Selected file path:', file);
  };

  const handleDeleteFile = async (file) => {
    if (confirm(`Bạn có chắc chắn muốn xóa file ${file}?`)) {
      const [ actualFilename, pathPrefix ] = splitRelativePath(file);
      try {
        await api.delete('/file/delete', {
          params: {
            subpath: pathPrefix,
            filename: actualFilename,
          },
        });
        alert('✅ Xóa thành công');
        fetchFiles();
        setColumns([]);
        setFormFiles(formFiles.filter((f) => f !== file));
        setSelectedFile(null);
      } catch (err) {
        console.error(err);
        alert('❌ Không thể xóa file');
      }
    }
  }
  const handleDownloadFile = async (file) => {
    const [ actualFilename, pathPrefix ] = splitRelativePath(file);
    try {
      const res = await api.get('/file/download', {
        params: {
          subpath: pathPrefix,
          filename: actualFilename,
        },
        responseType: 'blob', // Để nhận dữ liệu nhị phân
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
  }

  // QUANTIFY JD SECTION

  const [ minScore, setMinScore ] = useState(1);
  const [ maxScore, setMaxScore ] = useState(5);

  const quantifyJD = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn 1 JD (định dạng ".txt") để phân tích');
      return;
    }

    const [ actualFilename, pathPrefix ] = splitRelativePath(selectedFile);
    if (!actualFilename.endsWith('.txt')) {
        alert('Vui lòng chọn file có định dạng ".txt" để phân tích');
        return;
    }

    try {
        const res = await api.get('/jd-quantifier/execute/', {
            params: {
              subpath: pathPrefix,
              filename: actualFilename,
              scoring_scale_min: minScore,
              scoring_scale_max: maxScore,
            }
          });
      alert(`✅ Phân tích thành công. Kết quả được lưu tại: ${response.data.result_path}`);
    } catch (err) {
      console.error(err);
      alert('❌ Phân tích thất bại');
    }
    fetchFiles();
  }

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-[#f8f9fa] to-[#e0f7fa] text-gray-800">
      {/* Sidebar Storage */}
        <aside className="w-1/4 border-r border-gray-300 bg-white p-4 overflow-y-auto">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-6 text-center text-indigo-800">File Storage</h1>
            
            {selectedFile && (
              <div className="mb-4 p-2 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">Selected: {selectedFile}</p>
                <div className="flex mt-2 space-x-2">
                  <button 
                    onClick={() => handleDownloadFile(selectedFile)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                  >
                    📥 Download
                  </button>
                  <button 
                    onClick={() => handleDeleteFile(selectedFile)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>
          <h2 className="font-bold text-green-600 text-lg mb-2">📤 Uploads</h2>
          <button
            onClick={() => handleUpload('Form')}
            className="mb-3 text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
          >
            Upload Form
          </button>
          <input id="formUpload" type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
          {fileGroups["uploads"].map((file) => (
            <div
          key={file}
          onClick={() => handleSelectFile(file)}
          className={`p-2 mb-2 cursor-pointer rounded transition ${
            selectedFile === file ? 'bg-green-100 font-semibold text-green-800' : 'hover:bg-gray-100'
          }`}
            >
          {file.replace('uploads/', '')}
            </div>
          ))}
          
          <hr className="my-4" />        
          
          <h2 className="font-bold text-indigo-600 text-lg mb-2">📄 Resume Parser</h2>
          {fileGroups["resume_parser"].map((file) => (
            <div
          key={file}
          onClick={() => handleSelectFile(file)}
          className={`p-2 mb-2 cursor-pointer rounded transition ${
            selectedFile === file ? 'bg-blue-100 font-semibold text-blue-800' : 'hover:bg-gray-100'
          }`}
            >
          {file.replace('results/resume_parser/', '')}
            </div>
          ))}
          
          <hr className="my-4" />        
          
          <h2 className="font-bold text-indigo-600 text-lg mb-2">📊 JD Quantifier</h2>
          {fileGroups["jd_quantifier"].map((file) => (
            <div
          key={file}
          onClick={() => handleSelectFile(file)}
          className={`p-2 mb-2 cursor-pointer rounded transition ${
            selectedFile === file ? 'bg-purple-100 font-semibold text-purple-800' : 'hover:bg-gray-100'
          }`}
            >
          {file.replace('results/jd_quantifier/', '')}
            </div>
          ))}

          <hr className="my-4" />        
          
          <h2 className="font-bold text-indigo-600 text-lg mb-2">📝 Grader Summarizer</h2>
          {fileGroups["grader_summarizer"].map((file) => (
            <div
          key={file}
          onClick={() => handleSelectFile(file)}
          className={`p-2 mb-2 cursor-pointer rounded transition ${
            selectedFile === file ? 'bg-yellow-100 font-semibold text-yellow-800' : 'hover:bg-gray-100'
          }`}
            >
          {file.replace('results/grader_summarizer/', '')}
            </div>
          ))}
        
          <hr className="my-4" />        
          
          <h2 className="font-bold text-indigo-600 text-lg mb-2">🤖 Decision Maker</h2>
          {fileGroups["decision_maker"].map((file) => (
            <div
          key={file}
          onClick={() => handleSelectFile(file)}
          className={`p-2 mb-2 cursor-pointer rounded transition ${
            selectedFile === file ? 'bg-pink-100 font-semibold text-pink-800' : 'hover:bg-gray-100'
          }`}
            >
          {file.replace('results/decision_maker/', '')}
            </div>
          ))}
        </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold text-purple-700 flex items-center gap-2">
            Bạn hãy tải job description lên để tạo bảng điểm đánh giá ứng viên nhé!
          </h3>
          <div className="mt-6">
            <button
                onClick={quantifyJD}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
                Tạo bảng điểm
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
