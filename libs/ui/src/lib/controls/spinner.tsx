import React from "react";
import { Spinner } from '@radix-ui/themes';
import { useSpinner } from "@cookers/providers";

export const FormSpinner: React.FC = () => {
  const { isSpinnerLoading } = useSpinner();
  if (!isSpinnerLoading) return null;

  return (
    <div
    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
    role="alert"
    aria-busy="true"
    aria-live="assertive"
  >
    <Spinner size="3" />
  </div>
  );
};


