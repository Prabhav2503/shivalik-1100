import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const generateTokenAndSetCookie = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    path: '/',
  };

  const response = NextResponse.json(
    { message: 'Token generated and set as cookie' },
    { status: 200 }
  );

  response.cookies.set('token', token, cookieOptions);
  return response;
};
