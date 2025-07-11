import { CustomFile } from '@cookers/models';
import { RootState } from '@cookers/store';
import { SelectField, Text } from '@cookers/ui';
import { Box, Button, Flex, Table } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export interface fileUploaderProps {
  onFileSelect: (value: CustomFile[]) => void;
}

export const FileUploader: React.FC<fileUploaderProps> = ({ onFileSelect }) => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const [selectedValue, setSelectedValue] = React.useState('OTHE');
  const [selectedDoc, setSelectedDoc] = useState('OTHE');
  const MAX_FILE_SIZE = 15974; // 15.6MB
  const [file, setFile] = useState<CustomFile[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const files: CustomFile[] = [];
  useEffect(() => {
    if (masterData.documentTypeList.length > 0 && !selectedValue) {
      setSelectedValue(masterData.documentTypeList[0].value);
    }
  }, [masterData.documentTypeList]);
  const inputFile = useRef<HTMLInputElement>(null);

  const handleRemove = (): void => {
    setFile([]);
    setErrorMsg('');
    if (inputFile.current) {
      inputFile.current.value = '';
      inputFile.current.type = 'text';
      inputFile.current.type = 'file';
    }

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // handle validations
    console.log(selectedDoc);
    if (!e.target.files) return;

    const newFiles: CustomFile[] = Array.from(e.target.files).map((file) => {
      const customFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      }) as CustomFile;

      customFile.documentType = selectedDoc; // Add documentType
      return customFile;
    });
    setFile(newFiles);
    setSelectedDoc(selectedDoc);
  };

  const handleUpload = async () => {

    file.forEach(element => {
      element.documentType = selectedDoc
    });
    if (file && file.length > 0) {
      const largFileExist = file.find((a) => a.size / 1024 > MAX_FILE_SIZE);

      if (!largFileExist) {
        onFileSelect(file);
        handleRemove();
      } else {
        setErrorMsg('File size is greater than maximum limit');
      }
    }
  };

  const validateFileSize = (file: File) => {
    const fileSizeKB = file.size / 1024;

    if (fileSizeKB > MAX_FILE_SIZE) {
      setErrorMsg('File size is greater than maximum limit');
    }
  };

  const handleButtonClick = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };
  const handleDocChange = (data: string) => {
    setSelectedDoc(data);
  };

  return (
    <div>
      <Flex direction="column" gap="2">
        <SelectField data={masterData.documentTypeList} defaultValue={selectedValue} onValueChange={handleDocChange} />

        <input type="file" onChange={handleFileChange} ref={inputFile} multiple className="hidden-file-input" />
        <Button radius="full" color="indigo" variant="soft" onClick={handleButtonClick} type="button">
          Upload Files
        </Button>
        <Text size="1" align="center">
          Max Size : 15.6MB
        </Text>
      </Flex>
      {file && file.length > 0 && (
        <Box>
          <Table.Root size="1">
            <Table.Body>
              {file.map((item, i) => (
                <Table.Row key={i}>
                  <Table.Cell width="70%">
                    <Text size="1">{item.name} </Text>
                  </Table.Cell>
                  <Table.Cell width="30%">
                    <Text size="1">{item.size} KB</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <section>
            <Text size="1" color="red">
              {errorMsg}
            </Text>
          </section>

          <Flex align="center" gap="3" mt="1">
            <Button onClick={handleUpload} variant="surface" type="button">
              Upload
            </Button>
            <Button onClick={handleRemove} variant="outline" color="red" type="button">
              Cancel
            </Button>
          </Flex>
        </Box>
      )}
    </div>
  );
};
