import React from 'react';
import { Flex, Text, Spinner } from '@radix-ui/themes';

export interface LoadingOverlayProps {
  /** Whether to show the loading overlay */
  isVisible: boolean;
  /** Custom loading message to display */
  message?: string;
  /** Custom z-index for the overlay */
  zIndex?: number;
  /** Custom background color for the overlay */
  backgroundColor?: string;
  /** Custom blur amount for the backdrop filter */
  blurAmount?: string;
  /** Whether to disable pointer events on the overlay */
  disablePointerEvents?: boolean;
  /** Custom minimum height for the overlay */
  minHeight?: string;
  /** Custom styles for the overlay container */
  overlayStyle?: React.CSSProperties;
  /** Custom styles for the content container */
  contentStyle?: React.CSSProperties;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  zIndex = 999,
  backgroundColor = 'rgba(255, 255, 255, 0.8)',
  blurAmount = '3px',
  disablePointerEvents = true,
  minHeight = '100px',
  overlayStyle,
  contentStyle,
}) => {
  if (!isVisible) {
    return null;
  }

  const defaultOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor,
    backdropFilter: `blur(${blurAmount})`,
    WebkitBackdropFilter: `blur(${blurAmount})`, // Safari support
    zIndex,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: disablePointerEvents ? 'none' : 'auto',
    minHeight,
    ...overlayStyle,
  };

  const defaultContentStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    ...contentStyle,
  };

  return (
    <div style={defaultOverlayStyle}>
      <div style={defaultContentStyle}>
        <Flex gap="3" align="center">
          <Spinner />
          <Text size="2" weight="medium" style={{ color: '#333' }}>
            {message}
          </Text>
        </Flex>
      </div>
    </div>
  );
};