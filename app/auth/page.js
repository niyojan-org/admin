// app/(auth)/page.js
'use client';

import { use, useEffect } from 'react';
import Auth from '../../components/Auth';
import { setAccessToken } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
// app/(auth)/page.js
export default function AuthPage({ searchParams }) {
  const param = use(searchParams);
  const { setToken } = useUserStore();

  useEffect(() => {
    if (param?.token) {
      setAccessToken(param.token);
      setToken();
    }
  }, []);

  return <Auth />;
}