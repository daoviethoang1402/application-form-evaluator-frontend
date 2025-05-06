'use client';
import { useState } from 'react';

export default function HomePage() {
  // const [cvFiles, setCvFiles] = useState(['cv_1.pdf', 'cv_2.pdf']);
  const [formFiles, setFormFiles] = useState(['form_1.xlsx']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showInput, setShowInput] = useState(false);

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
    alert(`Upload ${type} (chưa tích hợp thực tế, chỉ mô phỏng)`);
  };

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
        {formFiles.map((file) => (
          <div
            key={file}
            onClick={() => setSelectedFile(file)}
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
          {['Họ tên', 'Email', 'Câu hỏi 1', 'Câu hỏi 2'].map((cat) => (
            <label key={cat} className="block mb-2 text-md text-gray-800">
              <input
                type="checkbox"
                className="mr-2 accent-purple-500"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}

          {/* Textarea - nhập tiêu chí muốn trích từ CV */}
          <div className="mt-6">
            <h4 className="mb-2 text-md font-medium text-purple-600">
              ✍️ Nhập các tiêu chí cần trích xuất từ CV (ví dụ: kỹ năng, kinh nghiệm...):
            </h4>
            <textarea
              rows={4}
              className="w-full p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Ví dụ: Python, React, Thuyết trình, Quản lý thời gian..."
            ></textarea>
          </div>

          {/* Nút Hoàn tất chỉ hiện khi đủ dữ liệu */}
          {/*selectedCategories.length > 0 && cvInput.trim() !== '' &&*/ (
            <button
              onClick={() => {
                alert('✅ Dữ liệu đã sẵn sàng để gửi lên backend!');
                // TODO: Gọi API tại đây nếu cần
              }}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded shadow"
            >
              ✅ Hoàn tất
            </button>
          )}
        </div>

        {/* Preview */}
        {selectedFile && (
          <div className="mt-6 bg-white shadow border-l-4 border-blue-400 p-4 rounded-md">
            <h3 className="font-bold text-blue-700 text-lg">📜Preview: {selectedFile}</h3>
            <p className="text-sm text-gray-600 mt-2">Hiển thị nội dung giả lập của file được chọn.</p>
          </div>
        )}
      </main>
    </div>
  );
}
