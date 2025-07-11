import React from 'react';

export interface  DropDownMenuItem  {
    id: string;
    label?: string;
    shortcut?: string;
    color?: 'red';
    action?: () => void;
    isSeparator: boolean;
    btnIcon?: React.ReactNode;
    disabled?: boolean;
  };