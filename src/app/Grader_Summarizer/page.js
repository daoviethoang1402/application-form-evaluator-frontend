'use client';
import { useState } from 'react';
import axios from 'axios';
import { useFileContext } from '../contexts/FileContext';

const api = axios.create({
  baseURL: '/api',
});

export default function GraderSummarizer() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {fileGroups, selectedFile, splitRelativePath} = useFileContext();

  // GRADING SECTION
  const [ jdSchema, setJdSchema ] = useState(null);
  const handleGrading = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file để chấm điểm!');
      return;
    }

    const [ actualFilename, pathPrefix ] = splitRelativePath(selectedFile);
    if (!actualFilename.endsWith('.xlsx')) {
      alert('Vui lòng chọn file Excel chứa câu trả lời để phân tích');
      return;
    }
    // alert('Các câu trả lời đang được xử lý. Vui lòng chờ trong giây lát. Thời gian chờ tùy thuộc vào số lượng ứng viên. Nhấn "OK" để chạy.');
    try {
      const res = await api.get('/grader-summarizer/evaluate-all/', {
        params: {
          subpath: pathPrefix,
          filename: actualFilename,
          jd_schema_filename: jdSchema,
        }
      });
      alert(`✅ Chấm điểm thành công. Kết quả được lưu tại: ${response.data.result_path}`);
    } catch (err) {
      console.error(err);
      alert('❌ Chấm điểm thất bại');
    }
    fetchFiles();
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-[#f8f9fa] to-[#e0f7fa] text-gray-800">
      {/* Main Panel */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold text-purple-700 flex items-center gap-2">
            Bạn hãy chọn một bộ câu trả lời (Excel) và một bảng điểm (JSON, bên trong "JD Quantifier") để chấm điểm ứng viên nhé!
          </h3>
          <div className="mb-4"></div>
            <label htmlFor="jsonSchema" className="block text-sm font-medium text-gray-700 mb-2">
              Select JD Quantifier Schema (JSON):
            </label>
            <select
              id="jsonSchema"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedCategories.length ? selectedCategories[0] : ''}
              onChange={(e) => {setSelectedCategories([e.target.value]); setJdSchema(e.target.value.replace('results/jd_quantifier/', ''));}}
            >
              <option value="">-- Select a JSON schema --</option>
              {fileGroups["jd_quantifier"]
                .filter(file => file.endsWith('.json'))
                .map((file) => (
                  <option key={file} value={file}>
                    {file.replace('results/jd_quantifier/', '')}
                  </option>
                ))}
            </select>
            {selectedCategories.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                Selected schema: {selectedCategories[0].replace('results/jd_quantifier/', '')}
              </p>
            )}
          <div className="mt-6">
            <button
                onClick={handleGrading}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
                Chấm điểm ứng viên
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
