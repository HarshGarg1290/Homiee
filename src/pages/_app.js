import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/contexts/ModalContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </AuthProvider>
  );
}
