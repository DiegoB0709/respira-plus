import { AuthProvider } from "./AuthContext";
function ContextContainer({ children }) {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  );
}

export default ContextContainer;
