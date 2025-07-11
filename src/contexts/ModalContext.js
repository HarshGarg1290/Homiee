import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isLoginOpen,
        openLogin,
        closeModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
