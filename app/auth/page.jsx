import { use } from 'react';
import Auth from '@/app/auth/components/Auth';



export default function AuthPage({ searchParams }) {
  const param = use(searchParams);

  return (
    <Auth view={param.view} />
  )
}