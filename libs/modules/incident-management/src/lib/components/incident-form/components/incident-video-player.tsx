import React from 'react';
interface IncidentVideoPlayerProps {
  title: string;
  videoLink: string;
}
const extractVimeoId = (url: string) => {
  //const regex = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)/;
  //const match = url.match(regex);
  //return match ? match[1] : null; // Return the Vimeo ID or null if not found

  const parts = url.split('/');
  return parts[parts.length - 1];

};
export const IncidentVideoPlayer: React.FC<IncidentVideoPlayerProps> = ({ title, videoLink }) => {
  const videoId = extractVimeoId(videoLink);
  if (!videoId) {
    return <div>Invalid Vimeo URL</div>; // Handle invalid Vimeo URL
  }
  return (
    <div style={{ marginTop: '10px' }}>

      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        style={{ border: 'none' }}
        width="100%"
        height="400px"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

