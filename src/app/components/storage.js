'use client';
import { useFileContext } from '../contexts/FileContext';

export const Storage = () => {
  const {
    selectedFile,
    fileGroups,
    handleSelectFile,
    handleDeleteFile,
    handleUpload,
    handleFileChange,
    handleDownloadFile
  } = useFileContext();

  return (
    <aside className="w-100 border-r border-gray-300 bg-white p-4 overflow-y-auto">
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
      <h2 className="font-bold text-green-600 text-lg mb-2">📤 Responses</h2>
      <button
        onClick={() => handleUpload('Form')}
        className="mb-3 text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
      >
        Upload
      </button>
      <input id="formUpload" type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
      {fileGroups["responses"].map((file) => (
        <div
          key={file}
          onClick={() => handleSelectFile(file)}
          className={`p-2 mb-2 cursor-pointer rounded transition ${
            selectedFile === file ? 'bg-green-100 font-semibold text-green-800' : 'hover:bg-gray-100'
          }`}
        >
          {file.replace('responses/', '')}
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
  );
};