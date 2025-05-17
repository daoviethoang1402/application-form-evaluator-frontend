'use client';
import { useState } from 'react';
import axios from 'axios';
import { useFileContext } from '../contexts/FileContext';

const api = axios.create({
  baseURL: '/api',
});

export default function JDPage() {
  const {selectedFile, splitRelativePath} = useFileContext();

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
    // Thông báo rằng bảng điểm đang được tạo ra.
    try {
        const res = await api.get('/jd-quantifier/execute/', {
            params: {
              subpath: pathPrefix,
              filename: actualFilename,
              scoring_scale_min: minScore,
              scoring_scale_max: maxScore,
            }
          });
      alert(`✅ Tạo bảng điểm thành công. Kết quả được lưu tại: ${response.data.result_path}`);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert('❌ Tạo bảng điểm thất bại');
    }
    // fetchFiles();
  }

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-[#f8f9fa] to-[#e0f7fa] text-gray-800">
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
