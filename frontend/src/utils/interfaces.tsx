import React from "react";

export interface ILink {
  name: string;
  href: string;
  icon?: string  | React.ReactNode;
}


export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  role: string;
} 