import { Metadata } from 'next';
import Login from '@/components/Login';
import { ADMIN_METADATA } from '@/constants';

export const metadata: Metadata = {
  title: ADMIN_METADATA.LOGIN.TITLE,
  description: ADMIN_METADATA.LOGIN.DESCRIPTION,
  robots: ADMIN_METADATA.LOGIN.ROBOTS,
};

export default function LoginPage() {
  return <Login />;
} 