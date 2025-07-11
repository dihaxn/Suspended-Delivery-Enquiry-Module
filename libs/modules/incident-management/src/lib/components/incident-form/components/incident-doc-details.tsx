import { DocDetailModel, VideoDetailModel } from '@cookers/models';
import { FileUploader, VideoLinkUploader } from '@cookers/modules/shared';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Heading, IconButton, Link, Table, Tabs, Text, Tooltip } from '@radix-ui/themes';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EyeOpenIcon, PlayIcon, TrashIcon, VideoIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import './incident-form.css';
import { convertBase64ToBlob,formattoJsonDate,getUserFromLocalStorage } from '@cookers/utils';
import { getFileContent } from '@cookers/modules/incident-management';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';
import { DeleteAlertDialog,FormDialog} from '@cookers/ui';
import { CustomFile } from '@cookers/models';
import { RootState,setDocUnsaveCount,setIncidentDocDeleted } from '@cookers/store';
import { useSelector,useDispatch } from 'react-redux';
import {IncidentVideoPlayer} from './incident-video-player'

export const IncidentDocDetails = () => {
  const VIMIO_URL = 'https://vimeo.com/';
  const dispatch = useDispatch();
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isModelDialogOpen, setModelDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DocDetailModel | undefined>();
  const { setValue, register, getValues } = useFormContext();
  const { docReadOnly } = useIncidentReadOnly();
  const [render, setRerender] = useState(0);
  const sessionUser = getUserFromLocalStorage();
  const onDeleteFile = (item: DocDetailModel) => {
    const datatobedeleted=item;
    const newDocList: DocDetailModel[] = getValues('incidentResource');
    setValue(
      'incidentResource',
      newDocList.filter((d) => d.name !== item.name)
    );
    if(datatobedeleted.documentId=="0"){
      dispatch(setDocUnsaveCount({ type: 'decrement', value: 1 }));
    }
    else{
      dispatch(setIncidentDocDeleted(true));
    }
    setDeleteDialogOpen(false);
    setSelectedItem(undefined);
    setRerender((render) => render + 1); // update state to force render
  };

  const onViewFile = (item: DocDetailModel) => {
    let objURL = item.path;
    if (objURL) openWindow(objURL);
    else getDocContentDetails(item.documentId);
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };
  const handleConfirmDelete = (item: DocDetailModel) => {
    onDeleteFile(item);
   
  // Close the delete dialog
  
  };
  const handleDeleteDialogClose = () => {
  // Reset selectedItem when closing the dialog to ensure it's clean
  setSelectedItem(undefined);
  setDeleteDialogOpen(false);
};
  const handleFileChange = (fileValue: CustomFile[]) => {
    console.log(fileValue);
    if (fileValue && fileValue.length > 0) {
      const newDocList: DocDetailModel[] = getValues('incidentResource');

      fileValue.forEach((f) => {
        const file = f;
        const fileName = file.name;
        const extension = fileName.split('.').pop();
        const fileExtension = extension ?? file.type;
      const docType=f.documentType
        const checkFileExist = (fileName: string) => newDocList.some(({ name }) => name == fileName);

        if (!checkFileExist(fileName)) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            if (fileReader.result != null) {
              const newDocument = {
                documentId: '0',
                type: 'd',
                name: fileName,
                path: URL.createObjectURL(file),
                extension: fileExtension.toLowerCase(),
                detailedExtension: fileExtension,
                documentFile: fileReader.result.toString(),
                incidentId: '0',
                createdDate: formattoJsonDate(new Date()),
                lastModifiedDate: formattoJsonDate(new Date()),
                createdBy: sessionUser?.originator,
                lastModifiedBy: sessionUser?.originator,
                docType:docType
              };

              newDocList.push(newDocument);
              setValue('incidentResource', newDocList);
              dispatch(setDocUnsaveCount({ type: 'increment', value: 1 }));
              setRerender((render) => render + 1);
            }
          };
        }
      });
    }
  };

  const handleVideoChange = (videoFile: VideoDetailModel) => {
    const newDocList: DocDetailModel[] = getValues('incidentResource');
    const newDocument = {
      documentId: '0',
      type: 'v',
      name: videoFile.vemioLink,
      path: videoFile.description,
      extension: '',
      detailedExtension: '',
      documentFile: '',
      incidentId: '0',
      createdDate: '',
      lastModifiedDate: '',
      createdBy: '',
      lastModifiedBy: '',
      docType:''
    };
    newDocList.push(newDocument);
    setValue('incidentResource', newDocList);
    dispatch(setDocUnsaveCount({ type: 'increment', value: 1 }));
    setRerender((render) => render + 1);
  };

  const getDocContentDetails = async (documentId: string) => {
    const { incidentDocData } = await getFileContent(documentId);

    const base64DocumentFile = incidentDocData.documentFile;
    const mimeType = incidentDocData.detailedExtension; // ex: 'image/jpeg'; //'text/plain';

    const blob = convertBase64ToBlob(base64DocumentFile, mimeType);

    const objURL = URL.createObjectURL(blob);

    openWindow(objURL);
    updateDocList(documentId, objURL);
  };

  const updateDocList = (documentId: string, objURL: string) => {
    const docList: DocDetailModel[] = getValues('incidentResource');

    const nextCounters = docList.map((i) => {
      if (i.documentId === documentId) i.path = objURL;
    });

    setValue('incidentResource', docList);
    setRerender((render) => render + 1);
  };
  const handleDeleteDialog = (item: DocDetailModel) => {
  //const confirmed = window.confirm(`Are you sure you want to delete the file: ${item.name}?`);

   // if (confirmed) {
    //  const updatedDocs = getValues('incidentResource').filter((doc: DocDetailModel) => doc.name !== item.name);
    //  setValue('incidentResource', updatedDocs);
    //  setRerender((render) => render + 1);
   // } 
  console.log("item",item)
    setSelectedItem(item); // Set the specific item
   setDeleteDialogOpen(true); // Open dialog
  };
   const getDocValue = (value: string): string => {
    return masterData.documentTypeList.find(option => option.value === value)?.label || '';
    };
    const handleVideoPlayerDialog = (item: DocDetailModel) => {
      if(item.type="v"){
        setSelectedItem(item); // Set the specific item
        setModelDialogOpen(true); // Open dialog
      }       
      };

  return (
    <div style={{ width: '100%' }}>
      <Heading size="2" mb="3" align="center">
        Incident Documents
      </Heading>

      <Tabs.Root className="TabsRoot" defaultValue="documents">
        <Tabs.List className="TabsList">
          <Tabs.Trigger value="documents" className="TabsTrigger">
            Docs & Photos
          </Tabs.Trigger>
          <Tabs.Trigger value="videos" className="TabsTrigger">
            Video Link
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="TabsContent" value="documents">
          {!docReadOnly && <FileUploader onFileSelect={handleFileChange} />}
        </Tabs.Content>

        <Tabs.Content className="TabsContent" value="videos">
          {!docReadOnly && <VideoLinkUploader onSelect={handleVideoChange} />}
        </Tabs.Content>
      </Tabs.Root>

      <Table.Root size="1">
        <Table.Body {...register('incidentResource')}>
          {(getValues('incidentResource') as DocDetailModel[]).map((item, i) => (
            <Table.Row key={i}>
              <Table.Cell width="10%">
                {item.extension === 'png' && <FontAwesomeIcon icon={fa.faFileImage} color="orange" />}
                {item.extension === 'jpg' && <FontAwesomeIcon icon={fa.faFileImage} color="darkblue" />}
                {item.extension === 'pdf' && <FontAwesomeIcon icon={fa.faFilePdf} color="darkred" />}
                {(item.extension === 'doc' || item.extension === 'docx' || item.extension === 'csv') && (
                  <FontAwesomeIcon icon={fa.faFileWord} color="blue" />
                )}
                {(item.extension === 'xls' || item.extension === 'xlsx') && <FontAwesomeIcon icon={fa.faFilePdf} color="green" />}
                {item.extension === 'ppt' && <FontAwesomeIcon icon={fa.faFilePowerpoint} color="darkorange" />}
                {!item.extension && <VideoIcon width="12" height="12" color="red" />}
              </Table.Cell>
              <Table.Cell width="25%" maxWidth="150px">
                <Text size="1" wrap="pretty">{item.name}</Text>
              </Table.Cell>
              <Table.Cell width="25%" style={{ textAlign: 'right' }}>
                <Flex gap="2" justify="end" maxWidth="350px">
                  <Tooltip
                    content={
                      <div>
                        { item.type==='d' &&(<div>Doc: {getDocValue(item.docType)}</div>)}
                        { item.type==='v' &&( <div>Description: {item.path}</div> )}
                        <div>Created by: {item.createdBy}</div>
                        <div>Date: {item.createdDate}</div>
                      </div>
                    }
                  >
                    <DotsVerticalIcon width="12" height="12" />
                  </Tooltip>
                  {item.type === 'd' && (
                    <Link rel="noopener noreferrer" onClick={() => onViewFile(item)}>
                      <EyeOpenIcon width="12" height="12" />
                    </Link>
                  )}
                  {item.type === 'v' && (
                   <Link 
                   href={item.name} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onClick={(e) => {
                     e.preventDefault(); // Prevent default navigation behavior
                     handleVideoPlayerDialog(item); // Open the modal
                   }}
                 >
                   <PlayIcon width="12" height="12" />
                 </Link>
                  )}

                  {/* <Link color="crimson" size="1" rel="noopener noreferrer" onClick={() => onDeleteFile(item)}>
                    <TrashIcon width="12" height="12" color="crimson" />
                  </Link> */}
                  <IconButton
                    color="crimson"
                    variant="outline"
                    size="1"
                     type="button"
                    onClick={() => {
                     
                      handleDeleteDialog(item);
                    }}
                    disabled={docReadOnly}
                  >
                    <TrashIcon width="12" height="12" />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
       
      </Table.Root>
      {isDeleteDialogOpen && selectedItem && (
  <DeleteAlertDialog
    isOpen={isDeleteDialogOpen}
    onOpenChange={setDeleteDialogOpen}
    item={selectedItem}
    dialogTitle={selectedItem.type === "d" ? "Delete Document" : "Delete Video"}
    dialogDescription="Are you sure you want to delete this record?"
    confirmButtonText="Yes! Delete"
    onConfirm={() => handleConfirmDelete(selectedItem)}
  />
)}
{isModelDialogOpen && selectedItem &&(
   <FormDialog
        title=""
        name={selectedItem.documentId}
        content={<IncidentVideoPlayer title={selectedItem.path} videoLink={selectedItem.name}/>}
        size="lg"
        isOpen={isModelDialogOpen}
        onOpenChange={setModelDialogOpen}
       
      />
    )}
    </div>
  );
};
