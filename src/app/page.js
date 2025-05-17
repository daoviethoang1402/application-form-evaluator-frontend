'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useFileContext } from './contexts/FileContext';

const api = axios.create({
  baseURL: '/api',
});

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [resumeColumn, setResumeColumn] = useState(null);
  const [cvInput, setCvInput] = useState('');
  const [columns, setColumns] = useState([]);

  const {selectedFile, splitRelativePath, fetchFiles} = useFileContext();

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      const updated = selectedCategories.filter((c) => c !== cat);
      setSelectedCategories(updated);
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const fetchColumns = async (filename) => {
    const [ actualFilename, pathPrefix ] = splitRelativePath(filename);
    // Check if the file is Excel format before proceeding
    if (!actualFilename.toLowerCase().endsWith('.xlsx') && 
      !actualFilename.toLowerCase().endsWith('.xls') && 
      !actualFilename.toLowerCase().endsWith('.csv')) {
      console.log('Not an Excel file format');
      // alert('❌ File không đúng định dạng Excel (.xlsx, .xls, .csv)');
      setColumns([]);
      setResumeColumn(null);
      return [];
    }
    try {
      const res = await api.get('/file/excel/get-columns', {
        params: {
          subpath: pathPrefix,
          filename: actualFilename,
        }
      });
      setResumeColumn(res.data.resume_column_name);
      setColumns(res.data.columns);
      return res.data.columns;
    } catch (err) {
      console.error(err);
      alert('❌ Không lấy được danh sách cột');
      return [];
    }
  };

  const removeUnselectedColumns = async (filename, selected) => {
    const [ actualFilename, pathPrefix ] = splitRelativePath(filename);
    try {
      const res = await api.post(
        '/file/excel/select-columns',
        null,  // Không có body
        {
          params: {
            subpath: pathPrefix,
            filename: actualFilename,
            columns: selected,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' }); // xử lý đúng mảng
          },
        }
      );
      fetchFiles();
      return res.data.new_file_path;
    } catch (err) {
      console.error(err);
      alert('❌ Không thể xóa các cột');
      return null;
    }
  };

  const parseAll = async (filename) => {
    const [ actualFilename, pathPrefix ] = splitRelativePath(filename);
    alert('Các câu trả lời đang được xử lý. Vui lòng chờ trong giây lát. Thời gian chờ tùy thuộc vào số lượng ứng viên. Nhấn "OK" để chạy.');
    try {
      const res = await api.get('/resume-parser/parse-all/', {
        params: {
          subpath: pathPrefix,
          filename: actualFilename,
          required_fields: cvInput,
        }
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
    fetchFiles();
  };

  useEffect(() => {
    if (selectedFile) {
      fetchColumns(selectedFile);
    }
  }, [selectedFile]);

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-[#f8f9fa] to-[#e0f7fa] text-gray-800">
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
          
          {/* Nút Hoàn tất chỉ hiện khi đủ dữ liệu */}
          {selectedCategories.length > 0 && (
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

              const newPath = await removeUnselectedColumns(selectedFile, selectedCategories);
              if (!newPath) return;

                alert('✅ Đã xử lý xong file. Sẵn sàng để parse.');
              }}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded shadow mr-4"
            >
              ✅ Hoàn tất
            </button>
          )}

          {/* Textarea - nhập tiêu chí muốn trích từ CV */}
          {resumeColumn && (
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
          )}
          {cvInput.trim() !== '' && (
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
            )
          }

        </div>
      </main>
    </div>
  );
}
