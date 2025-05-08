'use client';
import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export default function HomePage() {
  // const [cvFiles, setCvFiles] = useState(['cv_1.pdf', 'cv_2.pdf']);
  const [formFiles, setFormFiles] = useState(['form_1.xlsx']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cvInput, setCvInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [columns, setColumns] = useState([]);

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      const updated = selectedCategories.filter((c) => c !== cat);
      setSelectedCategories(updated);
      if (updated.length === 0) setShowInput(false);
    } else {
      setSelectedCategories([...selectedCategories, cat]);
      setShowInput(true);
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
    } catch (err) {
      console.error(err);
      alert('❌ Upload thất bại');
    }
  };

  const fetchColumns = async (filename) => {
    try {
      const res = await api.get('/file/excel/get-columns', {
        params: {
          subpath: 'uploads',
          filename: filename,
          // sheet_name: 'Sheet1'  // nếu cần
        }
      });
      return res.data.columns;
    } catch (err) {
      console.error(err);
      alert('❌ Không lấy được danh sách cột');
      return [];
    }
  };

  const handleSelectFile = async (file) => {
    setSelectedFile(file);
    const cols = await fetchColumns(file);
    setColumns(cols);
  };
  

  const removeUnselectedColumns = async (filename, allColumns, selected) => {
    // const toRemove = allColumns.filter((col) => !selected.includes(col));
    console.log(selected);
    try {
      const res = await api.post(
        '/file/excel/select-columns',
        null,  // Không có body
        {
          params: {
            subpath: 'uploads',
            filename,
            columns: selected,
          },
        }
      );
      console.log(res.data);
      return res.data.new_file_path;
    } catch (err) {
      console.error(err);
      alert('❌ Không thể xóa các cột');
      return null;
    }
  };

  const parseAll = async (filename) => {
    try {
      const res = await api.post('/resume-parser/parse-all', {
        subpath: 'uploads',
        filename,
      });
      if (res.data.status === 'success') {
        alert(`✅ Parse thành công: ${res.data.file_path}`);
      } else {
        alert(`❌ Lỗi: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi hệ thống khi parse resume');
    }
  };

  // const handleFinish = async () => {
  //   if (!selectedFile) {
  //     alert('❗ Vui lòng chọn một file');
  //     return;
  //   }

  //   const allCols = await fetchColumns(selectedFile);
  //   if (!allCols.length) return;

  //   const newPath = await removeUnselectedColumns(selectedFile, allCols, selectedCategories);
  //   if (!newPath) return;

  //   await parseAll(selectedFile); // hoặc newPath.split('/').pop() nếu file được tạo mới
  // };




  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-[#f8f9fa] to-[#e0f7fa] text-gray-800">
      {/* Sidebar Storage */}
      <aside className="w-1/4 border-r border-gray-300 bg-white p-4 overflow-y-auto">
        <h2 className="font-bold text-green-600 text-lg mb-2">📊 Form Responses</h2>
        <button
          onClick={() => handleUpload('Form')}
          className="mb-3 text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
        >
          Upload Form
        </button>
        <input id="formUpload" type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
        {formFiles.map((file) => (
          <div
            key={file}
            onClick={() => handleSelectFile(file)}
            className={`p-2 mb-2 cursor-pointer rounded transition ${
              selectedFile === file ? 'bg-green-100 font-semibold text-green-800' : 'hover:bg-gray-100'
            }`}
          >
            {file}
          </div>
        ))}
        
        {/* <hr className="my-4" />        
        
        <h2 className="font-bold text-indigo-600 text-lg mb-2">📄 CV Files</h2>
        <button
          onClick={() => handleUpload('CV')}
          className="mb-3 text-sm text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded"
        >
          Upload CV
        </button>
        {cvFiles.map((file) => (
          <div
            key={file}
            onClick={() => setSelectedFile(file)}
            className={`p-2 mb-2 cursor-pointer rounded transition ${
              selectedFile === file ? 'bg-indigo-100 font-semibold text-indigo-800' : 'hover:bg-gray-100'
            }`}
          >
            {file}
          </div>
        ))} */}
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold text-purple-700 flex items-center gap-2">
            <input type="checkbox" checked readOnly className="accent-green-500" />
            Chọn cột giữ lại từ form:
          </h3>

          {/* Checkbox list - luôn hiển thị */}
          {columns.map((col) => (
            <label key={col} className="block mb-2 text-md text-gray-800">
              <input
                type="checkbox"
                className="mr-2 accent-purple-500"
                checked={selectedCategories.includes(col)}
                onChange={() => toggleCategory(col)}
              />
              {col}
            </label>
          ))}

          {/* Textarea - nhập tiêu chí muốn trích từ CV */}
          <div className="mt-6">
            <h4 className="mb-2 text-md font-medium text-purple-600">
              ✍️ Nhập các tiêu chí cần trích xuất từ CV:
            </h4>
            <textarea
              rows={4}
              className="w-full p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Ví dụ: Python, React, Thuyết trình, Quản lý thời gian..."
              value={cvInput}
              onChange={(e) => setCvInput(e.target.value)}
            ></textarea>
          </div>

          {/* Nút Hoàn tất chỉ hiện khi đủ dữ liệu */}
          {selectedCategories.length > 0 && cvInput.trim() !== '' && (
          <>
            <button
              onClick={async () => {
              if (!selectedCategories.includes('CV') && cvInput.trim() !== '') {
                const confirmContinue = window.confirm(
                  "⚠️ Bạn đã bỏ chọn cột 'CV' trong form, nhưng vẫn nhập tiêu chí cần trích từ CV.\n\nPhần nhập này sẽ bị bỏ qua. Bạn có chắc chắn muốn tiếp tục?"
                );
                if (!confirmContinue) return;
              }

              if (!selectedFile) {
                alert('❗ Vui lòng chọn một file');
                return;
              }

              const allCols = await fetchColumns(selectedFile);
              if (!allCols.length) return;

              const newPath = await removeUnselectedColumns(selectedFile, allCols, selectedCategories);
              if (!newPath) return;

                alert('✅ Đã xử lý xong file. Sẵn sàng để parse.');
              }}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded shadow mr-4"
            >
              ✅ Hoàn tất
            </button>

            <button
              onClick={() => {
                if (!selectedFile) {
                  alert('❗ Vui lòng chọn một file');
                  return;
                }
                parseAll(selectedFile); // hoặc file đã xử lý nếu có đường dẫn cụ thể hơn
              }}
              className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded shadow"
            >
              🚀 Parse All
            </button>
          </>
        )}

        </div>
      </main>
    </div>
  );
}
