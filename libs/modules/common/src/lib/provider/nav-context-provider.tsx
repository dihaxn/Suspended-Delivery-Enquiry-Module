import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


interface NavigationBlockContextProps {
  isBlocked: boolean;
  setBlocked: (blocked: boolean) => void;
  handleNavigation: (nextPath: string) => void;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  isDialogOpen: boolean;
}

const NavigationBlockContext = createContext<NavigationBlockContextProps | null>(null);

export const NavigationBlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [isBlocked, setBlocked] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (nextPath: string) => {
    if (isBlocked) {
      setPendingPath(nextPath); // Save the path for later
      setIsDialogOpen(true); // Show dialog
    } else {
      navigate(nextPath); // Navigate directly
    }
  };

  const confirmNavigation = () => {
    if (pendingPath) {
      navigate(pendingPath); // Navigate to the pending path
      setPendingPath(null);
    }
    setIsDialogOpen(false);
    setBlocked(false);
  };

  const cancelNavigation = () => {
    setPendingPath(null); // Clear pending navigation
    setIsDialogOpen(false);
  };

  return (
    <NavigationBlockContext.Provider
      value={{ isBlocked, setBlocked, handleNavigation, confirmNavigation, cancelNavigation, isDialogOpen }}
    >
      {children}
    </NavigationBlockContext.Provider>
  );
};

export const useNavigationBlock = () => {
  const context = useContext(NavigationBlockContext);
  if (!context) {
    throw new Error("useNavigationBlock must be used within a NavigationBlockProvider");
  }
  return context;
};
