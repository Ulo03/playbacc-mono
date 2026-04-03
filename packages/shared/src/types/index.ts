// packages/shared/src/types/index.ts

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  username: string | null;
  displayUsername: string | null;
  isPublic: boolean;
  role: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
