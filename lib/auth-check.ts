import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('__Secure-refresh_token')?.value;

  if (!token) {
    redirect('/auth');
  }

  return token;
}

export async function checkOrganization() {
  const cookieStore = await cookies();
  const orgData = cookieStore.get('organization')?.value;

  if (!orgData) {
    redirect('/organization');
  }

  try {
    return JSON.parse(orgData);
  } catch {
    redirect('/organization');
  }
}

export async function verifyUserAccess() {
  // Check auth first
  await checkAuth();

  // Then check organization
  const org = await checkOrganization();

  return org;
}
