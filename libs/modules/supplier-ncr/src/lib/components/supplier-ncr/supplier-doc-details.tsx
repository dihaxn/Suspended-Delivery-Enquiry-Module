import React, { useState } from 'react';

interface FileItem {
  id: string;
  file: File;
}

const MultipleDocumentUploader: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleUpload = () => {
    // Logic to handle file upload
    console.log(
      'Uploading files:',
      files.map((fileItem) => fileItem.file)
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Documents</h3>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
      />
      <ul className="space-y-2">
        {files.map((fileItem) => (
          <li key={fileItem.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-gray-200">
            <span className="text-sm text-gray-600">{fileItem.file.name}</span>
            <button onClick={() => handleRemoveFile(fileItem.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
              Remove
            </button>
          </li>
        ))}
      </ul>
      {files.length > 0 && (
        <button onClick={handleUpload} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          Upload All
        </button>
      )}
    </div>
  );
};

export default MultipleDocumentUploader;
