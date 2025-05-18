# User API Documentation

Base URL: `http://localhost:8080/api/v1/user`

## Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "email": "string (required)",      // Valid email format
  "password": "string (required)",   // Minimum 6 characters
  "fullname": "string (required)",   // Minimum 3 characters
  "role": "string (optional)"        // Either "user" or "admin", defaults to "user"
}
```

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepass123",
  "fullname": "John Doe",
  "role": "user"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Verification Mail Sent",
  "data": {
    "_id": "string",
    "email": "string",
    "fullname": "string",
    "role": "string",
    "isEmailVerified": false,
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 2. Login User
Authenticate and get access token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "string (required)",    // Valid email format
  "password": "string (required)"  // Minimum 6 characters
}
```

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Logged in successfully",
  "data": {
    "_id": "string",
    "email": "string",
    "fullname": "string",
    "role": "string",
    "isEmailVerified": boolean,
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 3. Verify Email
Verify user's email address using verification token.

**Endpoint:** `GET /verify-email/:token`

**Parameters:**
- `token`: Verification token received in email (required)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Account Verified",
  "data": {
    "user": {
      "_id": "string",
      "email": "string",
      "fullname": "string",
      "isEmailVerified": true
    }
  }
}
```

### 4. Resend Verification Email
Request a new verification email.

**Endpoint:** `POST /resend-verification-email`

**Request Body:**
```json
{
  "email": "string (required)"  // Valid email format
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Verification mail sent"
}
```

### 5. Request Password Reset
Initiate password reset process.

**Endpoint:** `PUT /forgot-password-request`

**Request Body:**
```json
{
  "email": "string (required)"  // Valid email format
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Forgot password link send"
}
```

### 6. Reset Password
Reset password using reset token.

**Endpoint:** `PUT /forgot-password/:forgotPasswordToken`

**Parameters:**
- `forgotPasswordToken`: Reset token received in email (required)

**Request Body:**
```json
{
  "password": "string (required)"  // Minimum 6 characters
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Password updated"
}
```

### 7. Get Current User
Get details of currently authenticated user.

**Endpoint:** `GET /`

**Headers:**
- `Cookie`: Must include valid access token

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User loaded",
  "data": {
    "_id": "string",
    "email": "string",
    "fullname": "string",
    "role": "string",
    "isEmailVerified": boolean,
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 8. Logout User
Logout current user and clear access token.

**Endpoint:** `DELETE /logout`

**Headers:**
- `Cookie`: Must include valid access token

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Error message",
  "errors": [
    {
      "fieldName": "Error description"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized Access"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "errors": [
    {
      "message": "Error details"
    }
  ]
}
```