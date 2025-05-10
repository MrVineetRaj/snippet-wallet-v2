export const PlatformUserRoles = {
  USER: "user",
  ADMIN: "admin",
};

export const AvailablePlatformUserRoles = Object.values(PlatformUserRoles);

export const CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: process.env.NODE_ENV === "production",
  secure: true,
};

export const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};
