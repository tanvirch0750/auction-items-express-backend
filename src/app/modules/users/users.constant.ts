import { Gender, UserRole } from '@prisma/client';

export const gender: Gender[] = ['male', 'female', 'others'];
export const userRole: UserRole[] = ['admin', 'user'];

export const userFilterableFields: string[] = [
  'searchTerm',
  'fullName',
  'email',
  'role',
  'gender',
];

export const userSearchableFields = ['address', 'fullName'];
