import { VideoDetailModel } from '@cookers/models';
import { Text, TextField } from '@cookers/ui';
import { Box, Button, Flex } from '@radix-ui/themes';
import React, { useState } from 'react';

export interface videoLinkUploaderProps {
  onSelect: (value: VideoDetailModel) => void;
}

export const VideoLinkUploader: React.FC<videoLinkUploaderProps> = ({ onSelect }) => {
  const [vemioLink, setVemioLink] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<{ vemioLink: string; description: string }>({
    vemioLink: '',
    description: '',
  });

  const handleVemioLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVemioLink(e.target.value);
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleAdd = () => {
    setErrorMsg({ vemioLink: '', description: '' });

    
    const errors: { vemioLink?: string; description?: string } = {};
    if (vemioLink.trim() === '') {
      errors.vemioLink = 'Vimeo Link is Required';
    }
    if (description.trim() === '') {
      errors.description = 'Description is Required';
    }

    // If errors exist, update state and stop execution
    if (Object.keys(errors).length > 0) {
      setErrorMsg((prev) => ({ ...prev, ...errors }));
      return;
    }

    const newVideoLink = {
      videoId: '0',
      vemioLink: vemioLink,
      description: description,
    };

    handleRemove();
    onSelect(newVideoLink);
  };

  const handleRemove = (): void => {
    setVemioLink('');
    setDescription('');
  };

  return (
    <div>
      <Flex direction="column" gap="2">
        <Box>
          <Text size="1">Vimeo Link</Text>
          <TextField value={vemioLink} onChange={handleVemioLink} placeholder="Vimeo Link" />
          {errorMsg.vemioLink && (
            <Text color="red" size="1">
              {errorMsg.vemioLink}
            </Text>
          )}
        </Box>
        <Box>
          <Text size="1">Description</Text>
          <TextField value={description} onChange={handleDescription} placeholder="Description" />
          {errorMsg.description && (
            <Text color="red" size="1">
              {errorMsg.description}
            </Text>
          )}
        </Box>
        <Box>
          <Button variant="outline" onClick={handleAdd} type="button">
            Add Video
          </Button>
        </Box>
      </Flex>
    </div>
  );
};
