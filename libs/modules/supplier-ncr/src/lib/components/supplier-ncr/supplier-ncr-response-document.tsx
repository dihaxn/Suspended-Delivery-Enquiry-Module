import { removeSupplierNcrResource, STORE, useStoreSelector } from '@cookers/store';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircleX, FileCode, FileText } from 'lucide-react';
import { SupplierNcrFormSchemaApiType } from '../../schema';
import { DocDetailModel } from '@cookers/models';
import { convertBase64ToBlob } from '@cookers/utils';
import { getFileContent } from '../../queries/get-supplier-ncr-file-query';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { PopupMessageBox } from '@cookers/ui';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';

export const SupplierNcrResponseDocuments: React.FC<{ stepId: number; readonly?: boolean }> = ({ stepId, readonly = false }) => {
  const dispatch = useDispatch();
  const [currentDocumentId, setCurrentDocumentId] = useState<boolean | number>(false);
  const { selectedSupplierNcrFormApiData } = useStoreSelector(STORE.SupplierNcr);
  const data: SupplierNcrFormSchemaApiType = selectedSupplierNcrFormApiData;
  const responseDocuments = data?.supplierNcrResource?.filter((item) => item.stepId === stepId) || [];
  const handleDelete = (documentId: number) => {
    dispatch(removeSupplierNcrResource(documentId));
  };

  if (!responseDocuments) {
    return null;
  }
  const getDocContentDetails = async (documentId: number) => {
    const { incidentDocData } = await getFileContent(documentId);

    const base64DocumentFile = incidentDocData.documentFile;
    const mimeType = incidentDocData.detailedExtension; // ex: 'image/jpeg'; //'text/plain';

    const blob = convertBase64ToBlob(base64DocumentFile, mimeType);

    const objURL = URL.createObjectURL(blob);

    openWindow(objURL);
  };
  const onViewFile = (documentId: number, path: string) => {
    const objURL = path;
    if (objURL) openWindow(objURL);
    else getDocContentDetails(documentId);
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
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

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {currentDocumentId && <PopupMessageBox showCancelButton={true} isOpen={!!currentDocumentId} onOpenChange={setCurrentDocumentId} dialogTitle="Delete Document" dialogDescription="Are you sure you want to delete this file?" onConfirm={() => handleDelete(currentDocumentId as number)} confirmButtonLabel="Yes, Delete" cancelButtonLabel="cancel" />}
      {responseDocuments.map((item, index) => {
        const { icon, bgColor } = getFileTypeDetails(item.documentName);
        return (
          <div key={item.documentId} className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button key={item.documentId} onClick={() => onViewFile(item.documentId, item.path)} className={`flex items-center gap-2 px-3 pr-8 py-1 rounded-full ${bgColor} text-xs font-medium hover:outline-none hover:ring-2 hover:ring-blue-500 hover:bg-blue-50`} type="button">
                  {icon}
                  <span className="text-black">{item.documentName}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                <div className="flex items-start flex-col">
                  <div className="text-xs">Created By : {item.createdBy}</div>
                  <div className="text-xs">Created Date : {item.createdDate}</div>
                  <div className="text-xs">Doc : {item.extension}</div>
                </div>
              </TooltipContent>
            </Tooltip>
            <button
              disabled={readonly}
              onClick={() => {
                setCurrentDocumentId(item.documentId);
              }}
              className={`absolute top-0 right-0 p-1   ${readonly ? 'hover:bg-gray-200 text-gray-400' : 'hover:bg-red-200 hover:text-red-700 text-red-400'} rounded-full`}
              type="button"
            >
              <CircleX className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
