export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  username: string | null;
  displayUsername: string | null;
  isPublic: boolean | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  locale: string;
  timeFormat: string;
};

export type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  impersonatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicProfile = {
  id: string;
  username: string;
  displayUsername: string | null;
  name: string;
  image: string | null;
  isPublic: boolean | null;
  isOwner: boolean;
  createdAt: Date;
};
