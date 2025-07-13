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
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isLoginOpen,
        isSignupOpen,
        openLogin,
        openSignup,
        closeModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
