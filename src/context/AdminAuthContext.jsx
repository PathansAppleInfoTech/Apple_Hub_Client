import { createContext, useContext, useEffect, useState } from 'react';
import * as adminApi from '../api/admin';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getMe()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email, password) {
    const { admin: loggedInAdmin } = await adminApi.login(email, password);
    setAdmin(loggedInAdmin);
    console.log(loggedInAdmin)
    return loggedInAdmin;
  }

  async function signOut() {
    await adminApi.logout().catch(() => { });
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
