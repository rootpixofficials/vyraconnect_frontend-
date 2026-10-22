# Vyra Connect — Complete System API Documentation

Comprehensive REST API and Gateway Reference for **Vyra Connect** (Smart Vehicle Identification, Emergency Scanner, and 2-Way Privacy Calling Platform).

---

## 1. Environments & Base URLs

| Service | Environment | Base URL |
| :--- | :--- | :--- |
| **Backend Express API** | Production / Test | `https://api.vyraconnect.in/api`<br>*(Direct: `https://phpstack-1650272-6714822.cloudwaysapps.com/api`)* |
| **Frontend Application & Webhooks** | Test Server (Cloudways) | `https://phpstack-1650272-6724559.cloudwaysapps.com` |
| **Public Tag Scan URL Base** | Test Server (Cloudways) | `https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token={qr_token}` |

---

## 2. Authentication & Customer OTP Access

### `POST /api/auth/otp/send`
Sends a one-time login verification password (OTP) to the customer's mobile number.

- **Request Body**:
  ```json
  {
    "mobile": "9876543210",
    "purpose": "LOGIN"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to 9876543210",
    "mobile": "9876543210",
    "user_exists": true,
    "expires_in_seconds": 600,
    "test_otp": "748291"
  }
  ```

---

### `POST /api/auth/otp/verify`
Verifies the submitted OTP against active verification records and checks if the user is an existing customer.

- **Request Body**:
  ```json
  {
    "mobile": "9876543210",
    "otp": "748291"
  }
  ```

#### Scenario A: Existing User (`is_existing_user: true`)
When the mobile number is already registered to a customer profile in the system:
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "is_existing_user": true,
    "message": "OTP verified successfully. Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "customer": {
      "id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
      "customer_code": "CUST-819203",
      "full_name": "Nikhrawo",
      "mobile": "9876543210",
      "email": "user@example.com",
      "profile_image": null,
      "address": "HiLite Mall, Thondayad",
      "city": "Calicut",
      "state": "Kerala",
      "pincode": "673014",
      "status": "ACTIVE",
      "otp_verified": true,
      "vehicles": [
        {
          "id": "v1-uuid",
          "vehicle_type": "Four Wheeler",
          "registration_number": "KL 10 AV 4099",
          "make": "BMW",
          "model": "M340i",
          "color": "Portimao Blue",
          "status": "ACTIVE"
        }
      ],
      "emergency_contacts": [
        {
          "id": "e1-uuid",
          "name": "Emergency Desk",
          "relationship": "Brother",
          "mobile": "9876543211",
          "is_primary": true
        }
      ],
      "qr_codes": [
        {
          "id": "qr-uuid",
          "qr_serial": "V-000010",
          "qr_token": "2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
          "qr_url": "https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token=2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
          "status": "ACTIVE"
        }
      ]
    }
  }
  ```

#### Scenario B: New User (`is_existing_user: false`)
When the OTP is correct, but the mobile number is NOT associated with any existing customer, the API directs the user to register by returning `is_existing_user: false`, `action_required: "REGISTER"`, and the public registration URL:
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "is_existing_user": false,
    "action_required": "REGISTER",
    "message": "OTP verified successfully. User is not registered with this mobile number. Please register your account.",
    "mobile": "9876543210",
    "registration_url": "https://phpstack-1650272-6724559.cloudwaysapps.com/scan?mobile=9876543210&action=register"
  }
  ```

---

### `POST /api/auth/register` (or `POST /api/register`)
Direct self-service customer registration and account creation.
- Gracefully handles **already registered customers** by updating their profile and issuing an active session JWT token without unique constraint failures.
- If vehicle details or an unassigned QR token are supplied, automatically links and activates them.

- **Request Body**:
  ```json
  {
    "name": "Mohammed Nihal",
    "mobile": "9746910890",
    "email": "nihal@example.com",
    "address": "Floor 4, Cyberpark",
    "city": "Calicut",
    "state": "Kerala",
    "pincode": "673016",
    "vehicleType": "Four Wheeler",
    "registrationNumber": "KL 10 AV 4099",
    "make": "BMW",
    "model": "M340i",
    "color": "Portimao Blue",
    "emergencyName": "Emergency Desk",
    "emergencyMobile": "9876543211",
    "emergencyRelationship": "Brother",
    "token": "optional_qr_token"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Account registered and activated successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "213de586-4cf3-4696-a5e9-ee4889539907",
      "userId": "213de586-4cf3-4696-a5e9-ee4889539907",
      "customer_code": "CUST-598574",
      "name": "Mohammed Nihal",
      "full_name": "Mohammed Nihal",
      "mobile": "9746910890",
      "phone": "9746910890",
      "email": "nihal@example.com",
      "status": "ACTIVE",
      "otp_verified": true,
      "vehicles": [ ... ],
      "emergency_contacts": [ ... ],
      "qr_codes": [ ... ]
    },
    "customer": { ... same ... }
  }
  ```

---

### `POST /api/auth/login` (or `POST /api/login`)
Universal flexible login endpoint:
- **With OTP**: Pass `{ "mobile": "9746910890", "otp": "1234" }` to verify OTP and obtain session JWT token.
- **Without OTP**: Pass `{ "mobile": "9746910890" }` to dispatch a new one-time password.
- **With Credentials**: Pass `{ "username": "admin", "password": "..." }` for administrator login.

---

### `POST /api/admin/login`
Authenticates administrative personnel and generates access session.

- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "your_secure_password"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "admin-uuid",
      "name": "Nihal",
      "role": "SUPERADMIN"
    }
  }
  ```

---

## 3. QR Codes & Scanners Management

### `GET /admin/qr/list`
Retrieves up to 200 of the latest generated QR scanner tags with complete metadata.

- **Response `200 OK`**:
  ```json
  {
    "qrs": [
      {
        "id": "3d2511b1-7ecd-41fb-83f0-df22c2fc2439",
        "qr_serial": "V-000010",
        "qr_token": "2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
        "qr_url": "https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token=2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
        "qr_image_base64": "data:image/png;base64,iVBORw0KGgo...",
        "customer_id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
        "product_type": "V",
        "status": "ACTIVE",
        "batch_id": "475df71d-2eaf-4052-ad19-e9c96047b4d7",
        "generated_at": "2026-10-08T20:36:10.395Z",
        "activated_at": "2026-10-08T21:07:53.805Z",
        "expires_at": "2036-10-08T21:07:53.805Z"
      }
    ]
  }
  ```

### `POST /admin/qr-batches/bulk-generate`
Generates a batch of scannable QR sticker tags and prepares printable PDF sheets.

- **Request Body**:
  ```json
  {
    "quantity": 10,
    "productType": "V"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "message": "Bulk QR generated successfully",
    "batch": {
      "id": "batch-uuid",
      "batch_code": "BATCH-A1B2C3D4",
      "quantity": 10,
      "generated_count": 10,
      "status": "COMPLETED",
      "pdf_path": "/storage/batches/BATCH-A1B2C3D4.pdf"
    }
  }
  ```

### `POST /admin/qr/:id/activate`
Activates an available or assigned QR tag for a 10-year validity cycle.

### `POST /admin/qr/:id/block`
Disables public scans immediately when a vehicle tag is lost or suspended.
- **Request Body**:
  ```json
  { "reason": "Reported lost windshield tag" }
  ```

### `POST /admin/qr/:id/unblock`
Restores a previously blocked QR tag to its active status.

### `POST /admin/qr/:id/replace`
Generates a new replacement QR tag while automatically transferring customer ownership and archiving the old tag.
- **Request Body**:
  ```json
  { "reason": "Physical sticker damaged" }
  ```

### `POST /admin/qr/assign`
Links an available QR code to a customer record.
- **Request Body**:
  ```json
  {
    "qrId": "qr-uuid",
    "customerId": "customer-uuid"
  }
  ```

---

## 4. Multi-Vehicle Management Under Scanner (Admin-Only)

Each scanner tag (`QrCode`) is linked to an authorized Customer (`Customer`), which holds **multiple registered vehicles (`Vehicle[]`)**. The Admin UI allows direct assignment and registration of multiple cars or motorcycles under any specific scanner.

### `GET /admin/vehicles`
Lists all vehicles across all customer scanners.

- **Response `200 OK`**:
  ```json
  [
    {
      "id": "veh-uuid-1",
      "customer_id": "cust-uuid-1",
      "registration_number": "KL 55 BH 1234",
      "vehicle_type": "Two Wheeler",
      "make": "Yamaha",
      "model": "R15 V4",
      "color": "Racing Blue",
      "status": "ACTIVE",
      "created_at": "2026-10-08T21:07:53.802Z"
    },
    {
      "id": "veh-uuid-2",
      "customer_id": "cust-uuid-1",
      "registration_number": "KL 10 AV 4099",
      "vehicle_type": "Four Wheeler",
      "make": "Porsche",
      "model": "Taycan 4S",
      "color": "Carrara White",
      "status": "ACTIVE",
      "created_at": "2026-10-20T10:15:20.100Z"
    }
  ]
  ```

### `POST /admin/vehicles`
Adds a new vehicle under a customer's scanner.

- **Request Body**:
  ```json
  {
    "customer_id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
    "vehicle_type": "Four Wheeler",
    "registration_number": "KL 10 AV 4099",
    "make": "BMW",
    "model": "M340i xDrive",
    "color": "Portimao Blue"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "new-veh-uuid",
    "customer_id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
    "vehicle_type": "Four Wheeler",
    "registration_number": "KL 10 AV 4099",
    "make": "BMW",
    "model": "M340i xDrive",
    "color": "Portimao Blue",
    "status": "ACTIVE",
    "created_at": "2026-10-20T14:45:00.000Z"
  }
  ```

### `PATCH /admin/vehicles/:id`
Updates vehicle specifications (Make, Model, Color, Plate).

### `PATCH /admin/vehicles/:id/status`
Toggles vehicle status between `ACTIVE` and `BLOCKED`.
- **Request Body**: `{ "status": "BLOCKED" }`

### `DELETE /admin/vehicles/:id`
Removes a vehicle from the customer's scanner profile.

---

## 5. User & Customer Profile Management (View & Edit)

### `GET /api/user/:userId` (or `GET /api/user`, `GET /api/users/:userId`, `GET /api/customer/:id`)
**Dedicated User Get by UserId API Endpoint.**
Retrieves user account and vehicle profile by their unique identifier.

- **Supported Identifier Parameters**:
  - **Path Parameter**: `/:userId` or `/:id` (e.g. `213de586-4cf3-4696-a5e9-ee4889539907` or `CUST-598574` or `9746910890`)
  - **Query Parameter**: `?userId=...` or `?id=...` or `?mobile=...`
  - **Authorization Header**: `Bearer <JWT_TOKEN>` (automatically extracts user ID from decoded session token)
- **Automatic Matching Strategy**:
  1. Searches `Customer` table by UUID `id`
  2. Searches `Customer` table by `customer_code` (e.g. `CUST-598574`)
  3. Searches `Customer` table by `mobile` (matching normalized or country code variants)
  4. Searches administrative `User` table by `id` or `username`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "user": {
      "id": "213de586-4cf3-4696-a5e9-ee4889539907",
      "userId": "213de586-4cf3-4696-a5e9-ee4889539907",
      "customer_code": "CUST-598574",
      "full_name": "Mohammed Nihal",
      "name": "Mohammed Nihal",
      "mobile": "9746910890",
      "phone": "9746910890",
      "email": "nihal@example.com",
      "profile_image": null,
      "address": "Floor 4, Cyberpark",
      "city": "Calicut",
      "state": "Kerala",
      "pincode": "673016",
      "status": "ACTIVE",
      "otp_verified": true,
      "vehicles": [
        {
          "id": "v1-uuid",
          "vehicle_type": "Four Wheeler",
          "registration_number": "KL 10 AV 4099",
          "make": "BMW",
          "model": "M340i",
          "variant": "xDrive",
          "color": "Portimao Blue",
          "status": "ACTIVE",
          "created_at": "2026-10-20T10:15:20.100Z"
        }
      ],
      "emergency_contacts": [
        {
          "id": "e1-uuid",
          "name": "Emergency Desk",
          "relationship": "Brother",
          "mobile": "9876543211",
          "is_primary": true,
          "status": "ACTIVE"
        }
      ],
      "qr_codes": [
        {
          "id": "qr-uuid",
          "qr_serial": "V-000010",
          "qr_token": "2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
          "qr_url": "https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token=2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
          "status": "ACTIVE",
          "activated_at": "2026-10-08T21:07:53.805Z",
          "expires_at": "2036-10-08T21:07:53.805Z"
        }
      ]
    },
    "customer": { ... same ... },
    "data": { ... same ... }
  }
  ```

---

### `GET /api/customer/profile` or `GET /api/customer/profile/:id`
Retrieves a customer's detailed profile including all registered vehicles, emergency contacts, and active QR scanner tags.

- **Identification Options**:
  - **Path Parameter**: `/:id` (Customer UUID)
  - **Query Parameters**: `?id=...` or `?mobile=9876543210`
  - **Authorization Header**: `Bearer <JWT_TOKEN>` (token obtained from OTP verification)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "customer": {
      "id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
      "customer_code": "CUST-819203",
      "full_name": "Nikhrawo",
      "mobile": "9876543210",
      "email": "user@example.com",
      "profile_image": null,
      "address": "HiLite Mall, Thondayad",
      "city": "Calicut",
      "state": "Kerala",
      "pincode": "673014",
      "status": "ACTIVE",
      "otp_verified": true,
      "vehicles": [
        {
          "id": "v1-uuid",
          "vehicle_type": "Four Wheeler",
          "registration_number": "KL 10 AV 4099",
          "make": "BMW",
          "model": "M340i",
          "variant": "xDrive",
          "color": "Portimao Blue",
          "status": "ACTIVE",
          "created_at": "2026-10-20T10:15:20.100Z"
        }
      ],
      "emergency_contacts": [
        {
          "id": "e1-uuid",
          "name": "Emergency Desk",
          "relationship": "Brother",
          "mobile": "9876543211",
          "is_primary": true,
          "status": "ACTIVE"
        }
      ],
      "qr_codes": [
        {
          "id": "qr-uuid",
          "qr_serial": "V-000010",
          "qr_token": "2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
          "qr_url": "https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token=2f36045d6d33e087d90ec2c31af81ff8c082624f41bc87c05703bb07fd8d068c",
          "status": "ACTIVE",
          "activated_at": "2026-10-08T21:07:53.805Z",
          "expires_at": "2036-10-08T21:07:53.805Z"
        }
      ]
    }
  }
  ```

---

### `PATCH /api/customer/profile` or `PATCH /api/customer/profile/:id`
Updates customer personal profile details, address, or emergency contacts. (Also supports `PUT`).

- **Identification Options**:
  - `/:id` in URL, `?id=...`, `?mobile=...`, `{ "customerId": "..." }` in body, or `Bearer <JWT_TOKEN>` header.
- **Request Body**:
  ```json
  {
    "full_name": "Nikhrawo Updated",
    "email": "nikhrawo.new@gmail.com",
    "address": "Floor 4, Cyberpark",
    "city": "Calicut",
    "state": "Kerala",
    "pincode": "673016",
    "emergencyName": "Alex Morgan",
    "emergencyMobile": "9876543299",
    "emergencyRelationship": "Spouse"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "customer": {
      "id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
      "customer_code": "CUST-819203",
      "full_name": "Nikhrawo Updated",
      "mobile": "9876543210",
      "email": "nikhrawo.new@gmail.com",
      "address": "Floor 4, Cyberpark",
      "city": "Calicut",
      "state": "Kerala",
      "pincode": "673016",
      "status": "ACTIVE",
      "otp_verified": true,
      "vehicles": [ ... ],
      "emergency_contacts": [
        {
          "id": "e1-uuid",
          "name": "Alex Morgan",
          "relationship": "Spouse",
          "mobile": "9876543299",
          "is_primary": true
        }
      ],
      "qr_codes": [ ... ]
    }
  }
  ```

---

## 6. Public Tag Scan & Emergency Registration

### `GET /scan/:token`
Public endpoint queried by smartphones scanning a physical Vyra Smart Tag.

- **Path Parameter**: `token` (32-byte hex string)
- **Response Behavior**:
  - **`AVAILABLE`**: Directs scanner to tag onboarding & registration form.
  - **`ACTIVE`**: Returns vehicle identification, multiple vehicles under this scanner, emergency contacts, and activates masked communication actions.
  - **`BLOCKED`**: Returns `403 Forbidden` with blocking reason.

- **Response `200 OK` (Active Tag with Multiple Vehicles)**:
  ```json
  {
    "qr": {
      "id": "qr-uuid",
      "qr_serial": "V-000010",
      "status": "ACTIVE",
      "customer": {
        "full_name": "Nikhrawo",
        "mobile": "0987456321",
        "vehicles": [
          {
            "id": "v1",
            "registration_number": "KL 55 BH 1234",
            "vehicle_type": "Two Wheeler",
            "make": "Yamaha",
            "model": "R15",
            "status": "ACTIVE"
          },
          {
            "id": "v2",
            "registration_number": "KL 10 AV 4099",
            "vehicle_type": "Four Wheeler",
            "make": "BMW",
            "model": "M340i",
            "status": "ACTIVE"
          }
        ],
        "emergency_contacts": [
          {
            "name": "Emergency Desk",
            "mobile": "9876543210",
            "is_primary": true
          }
        ]
      }
    }
  }
  ```

### `POST /scan/:token/register`
Self-service customer activation for unassigned tags.
- **Request Body**:
  ```json
  {
    "name": "Vehicle Owner",
    "mobile": "+919876543210",
    "email": "owner@example.com",
    "vehicleType": "Four Wheeler",
    "registrationNumber": "KL 10 AV 4099",
    "make": "Audi",
    "model": "RS5"
  }
  ```

---

## 7. Exotel 2-Way Number Masking Gateway

Connects scanner and owner over an encrypted virtual PSTN proxy bridge so that **neither party's actual phone number is revealed**.

### `GET /api/call/mask`
Queries Exotel gateway health, authentication status, and business KYC state.

- **Response `200 OK`**:
  ```json
  {
    "service": "Vyra Connect 2-Way Call Masking",
    "provider": "Exotel",
    "account": {
      "configured": true,
      "statusCode": 200,
      "account": {
        "Sid": "rootpixtechnolgies1",
        "FriendlyName": "rootpixtechnolgies1 - nihalmohd8",
        "Type": "Trial",
        "Status": "active",
        "KycStatus": "uploaded"
      }
    }
  }
  ```

### `POST /api/call/mask`
Initiates a 2-way masked call bridge.

- **Request Body**:
  ```json
  {
    "scannerNumber": "+919746910890",
    "plateNumber": "KL 10 AV 4099",
    "ownerNumber": "+919746910890"
  }
  ```

- **Response `200 OK` (KYC Pending Graceful Fallback)**:
  ```json
  {
    "success": false,
    "kycPending": true,
    "scannerMasked": "+91 ••••• ••890",
    "ownerMasked": "+91 ••••• ••890",
    "virtualNumber": "08047190000",
    "message": "Exotel credentials are active! However, your Exotel account KYC verification is currently under review by their team. Once KYC is approved, calls will ring automatically."
  }
  ```

- **Response `200 OK` (Post-KYC Live Call Trigger)**:
  ```json
  {
    "success": true,
    "callSid": "exotel-call-sid-12345",
    "scannerMasked": "+91 ••••• ••890",
    "ownerMasked": "+91 ••••• ••890",
    "virtualNumber": "08047190000",
    "status": "in-progress"
  }
  ```

---

## 8. Store Orders & Contact Notification Webhooks

### `POST /api/order`
Submits ₹399 hardware kit purchases, writes order records to `data/orders.json`, and dispatches an HTML notification receipt to `vyraconnect.in@gmail.com` via authenticated Google SMTP.

- **Request Body**:
  ```json
  {
    "fullName": "Mohammed Nihal",
    "mobile": "+91 97469 10890",
    "email": "customer@gmail.com",
    "address": "Rootpix Technologies, Calicut",
    "city": "Calicut",
    "state": "Kerala",
    "pincode": "673001",
    "quantity": 1,
    "totalPrice": 399,
    "notes": "Fast delivery requested"
  }
  ```

### `POST /api/contact`
Submits general customer inquiries, writes entries to `data/contact_inquiries.json`, and dispatches notification emails with subject pattern `[Vyra Contact Inquiry]`.

---

## 8. Data Architecture Summary

```
+--------------------------------------------------------------------+
|                             Customer                               |
| (id, customer_code, full_name, mobile, email, address, status)     |
+---------------------------------+----------------------------------+
                                  |
                +-----------------+-----------------+
                | 1:N                               | 1:N
                v                                   v
+-------------------------------+   +--------------------------------+
|            QrCode             |   |            Vehicle             |
| (id, qr_serial, qr_token,     |   | (id, customer_id,              |
|  qr_url [TEST LINK ENFORCED], |   |  registration_number,          |
|  qr_image_base64, status)     |   |  vehicle_type, make, model)    |
+-------------------------------+   +--------------------------------+
```
