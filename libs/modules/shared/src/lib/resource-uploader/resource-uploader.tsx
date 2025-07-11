import { DocDetailModel } from '@cookers/models';
import { STORE } from '@cookers/store';
import { PopupMessageBox } from '@cookers/ui';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { convertBase64ToBlob, inMemoryfileStorage } from '@cookers/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloudOff, CloudUpload, Eye, FileCode, FileText, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
interface FileMetadata {
  id: string | number;
  name: string;
  size: number;
  type: string;
}

type stateObj = {
  groupId: string | number;
  files: FileMetadata[];
};

type FileUploaderProps = {
  onFileSelect?: (files: stateObj) => { type: string; payload: stateObj };
  groupId?: string | number;
  dataType: keyof typeof STORE;
  currentFiles?: any[];
  getFileContent?: (documentId: number) => Promise<{ incidentDocData: DocDetailModel }>;
  handleDelete?: (documentId: number) => void;
  isReadOnly?: boolean;
  hideFileUploader?: boolean;
};

export const ResourceUploader: React.FC<FileUploaderProps> = ({ onFileSelect, groupId, dataType, currentFiles, getFileContent, handleDelete, isReadOnly, hideFileUploader }) => {
  const [fileMetadata, setFileMetadata] = useState<FileMetadata[]>([]);
  const [currentDocumentId, setCurrentDocumentId] = useState<boolean | number>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showDuplicateFileNames, setShowDuplicateFileNames] = useState<string[]>([]);
  const { setValue, formState } = useFormContext();
  //const dispatch = useDispatch();

  // useEffect(() => {
  //   const obj: stateObj = {
  //     groupId: groupId ?? '',
  //     files: fileMetadata,
  //   };

  //   const action = onFileSelect(obj);
  //   if (action) {
  //     dispatch(action);
  //   }
  // }, [fileMetadata, onFileSelect, dispatch, groupId]);

  const getDocContentDetails = async (documentId: number) => {
    if (!getFileContent) return;
    const { incidentDocData } = await getFileContent(documentId);
    const base64DocumentFile = incidentDocData.documentFile;
    const mimeType = incidentDocData.detailedExtension;
    const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
    const objURL = URL.createObjectURL(blob);
    openWindow(objURL);
  };

  const getFileTypeDetails = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return { icon: <FontAwesomeIcon icon={fa.faFileImage} color="#ff0000" />, bgColor: 'bg-red-50' };
      case 'docx':
        return { icon: <FontAwesomeIcon icon={fa.faFileWord} color="#8568ff" />, bgColor: 'bg-blue-50' };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return { icon: <FontAwesomeIcon icon={fa.faImage} color="#fb9134" />, bgColor: 'bg-blue-100' };
      case 'txt':
        return { icon: <FileText className="text-gray-500" />, bgColor: 'bg-gray-100' };
      case 'js':
      case 'ts':
      case 'json':
        return { icon: <FileCode className="text-green-500" />, bgColor: 'bg-green-100' };
      default:
        return { icon: <FontAwesomeIcon icon={fa.faFile} />, bgColor: 'bg-gray-100' };
    }
  };

  const onViewFile = (documentId: number, path: string) => {
    const objURL = path;
    if (objURL) openWindow(objURL);
    else getDocContentDetails(documentId);
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };

  const handleDirtyForm = () => {
    console.log('handleDirtyForm');
    setValue('supplierNcrResource', true, { shouldDirty: true });
  };

  useEffect(() => {
    return () => {
      fileMetadata.forEach((file) => {
        inMemoryfileStorage.delete(file.id);
      });
    };
  }, []);

  useEffect(() => {
    setFileMetadata([]);
  }, [currentFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDirtyForm();
    const docs = event.target.files;
    if (docs) {
      const existingNames = new Set([...fileMetadata.map((f) => f.name.toLowerCase()), ...(currentFiles ? currentFiles.map((f) => f.documentName.toLowerCase()) : [])]);

      const newFiles: File[] = [];
      const duplicateFiles: string[] = [];

      Array.from(docs).forEach((doc) => {
        if (existingNames.has(doc.name.toLowerCase())) {
          duplicateFiles.push(doc.name);
        } else {
          newFiles.push(doc);
        }
      });

      if (duplicateFiles.length > 0) {
        setShowDuplicateFileNames(duplicateFiles);
      }

      if (newFiles.length > 0) {
        const newMetadata: FileMetadata[] = newFiles.map((doc) => {
          const id = `${dataType}-${groupId}-${doc.name}-${Date.now()}`;
          inMemoryfileStorage.set(id, doc);
          return {
            id,
            name: doc.name,
            size: doc.size,
            type: doc.type,
          };
        });

        setFileMetadata((prevMetadata) => [...prevMetadata, ...newMetadata]);
      }
    }
    event.target.value = '';
  };

  const handleDeletePreloadDocument = (currentDocumentId: number) => {
    handleDirtyForm();
    handleDelete && handleDelete(currentDocumentId as number);
  };

  const handleRemoveFile = (id: string | number) => {
    handleDirtyForm();
    setFileMetadata((prevMetadata) => prevMetadata.filter((file) => file.id !== id));
    inMemoryfileStorage.delete(id); // Remove the File object from memory
    if (fileInputRef.current) {
      // fileInputRef.current.value = '';
      console.log('fileInputRef.current.value', fileInputRef.current.value);
    }
  };

  return (
    <div className="flex flex-col m-4 space-y-4 space-x-0 lg:space-y-0 lg:flex-row lg:space-x-10">
      {/* Upload Section */}
      {!hideFileUploader && (
        <div className={`p-3 rounded-lg ${isReadOnly ? 'border-gray-200 bg-gray-50/20' : 'border-green-200 bg-green-50/20'} border-2 border-dashed w-full lg:w-1/4 lg:max-w-[298px]`}>
          <label className={`w-full h-full text-center flex flex-col items-center justify-center ${isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'} `}>
            {isReadOnly ? <CloudOff className="w-12 h-12 mx-auto mb-2 text-gray-700" /> : <CloudUpload className="w-12 h-12 mx-auto mb-2 text-green-500" />}
            <input disabled={isReadOnly} type="file" multiple draggable ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" />
            <span className="text-sm font-semibold text-gray-700">Click to upload the documents</span>
          </label>
        </div>
      )}

      {/* File List Section */}
      <div className=" flex-1">
        {handleDelete && currentDocumentId && (
          <PopupMessageBox showCancelButton={true} isOpen={!!currentDocumentId} onOpenChange={setCurrentDocumentId} dialogTitle="Delete Document" dialogDescription="Are you sure you want to delete this file?" onConfirm={() => handleDeletePreloadDocument(currentDocumentId as number)} confirmButtonLabel="Yes, Delete" cancelButtonLabel="cancel" />
        )}

        {/* Duplicate Files Popup */}
        {showDuplicateFileNames.length > 0 && (
          <PopupMessageBox
            isOpen={showDuplicateFileNames.length > 0}
            onOpenChange={() => setShowDuplicateFileNames([])}
            dialogTitle="Duplicate Files"
            dialogDescription={
              <div>
                File(s) with the same name already exist.
                <ul className="mt-2 list-disc list-inside text-red-600">
                  {showDuplicateFileNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            }
            confirmButtonLabel="OK"
            onConfirm={() => setShowDuplicateFileNames([])}
            showCancelButton={false}
          />
        )}

        <ul className="bg-indigo-50/20 rounded-lg shadow-sm divide-y divide-gray-200 h-full overflow-hidden">
          {currentFiles
            ?.filter((fileItem) => fileItem.stepId === groupId)
            .map((fileItem) => {
              const { icon, bgColor } = getFileTypeDetails(fileItem.documentName);
              return (
                <li key={fileItem.documentId} className={`flex items-center justify-between p-4 ${bgColor}`}>
                  <div className="flex items-center space-x-4">
                    {icon}
                    <span className="text-sm font-medium text-gray-800">{fileItem.documentName}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">{fileItem.createdBy}</span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-xs text-gray-500">{fileItem.createdDate}</span>
                    {getFileContent && (
                      <button type="button" onClick={() => onViewFile(fileItem.documentId, fileItem.path)} className="text-blue-500 hover:text-blue-700 text-xs font-medium">
                        <Eye size={18} />
                      </button>
                    )}
                    {handleDelete && !isReadOnly && (
                      <button type="button" onClick={() => setCurrentDocumentId(fileItem.documentId)} className="text-red-500 text-xs hover:text-red-700  font-medium">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          {fileMetadata.length > 0 &&
            fileMetadata.map((fileItem) => (
              <li key={fileItem.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-800">{fileItem.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">{(fileItem.size / 1024).toFixed(2)} KB</span>

                  <button
                    type="button"
                    onClick={() => {
                      const file = inMemoryfileStorage.get(fileItem.id);
                      if (file) {
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank');
                      }
                    }}
                    className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                  >
                    <Eye size={18} />
                  </button>
                  <button type="button" onClick={() => handleRemoveFile(fileItem.id)} className="text-red-500 text-xs hover:text-red-700  font-medium">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          {!fileMetadata.length && !currentFiles?.filter((fileItem) => fileItem.stepId === groupId).length && !hideFileUploader && <li className="p-4 text-center h-full text-gray-500 text-sm">{isReadOnly ? 'No files uploaded' : 'No files uploaded'}</li>}
        </ul>
      </div>
    </div>
  );
};
