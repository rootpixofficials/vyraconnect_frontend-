# Vyra Connect — Complete System API Documentation

Comprehensive REST API and Gateway Reference for **Vyra Connect** (Smart Vehicle Identification, Emergency Scanner, Dedicated Emergency Contacts, and 2-Way Privacy Calling Platform).

---

## 1. Environments & Base URLs

| Service | Environment | Base URL |
| :--- | :--- | :--- |
| **Backend Express API** | Production / Test | `https://api.vyraconnect.in/api`<br>*(Direct: `https://phpstack-1650272-6714822.cloudwaysapps.com/api`)* |
| **Frontend Application (Live)** | Cloudways Live Host | `https://vyraconnect.in` |
| **Frontend Application (Test)** | Cloudways Test Server | `https://phpstack-1650272-6724559.cloudwaysapps.com` |
| **Public Tag Scan URL Base** | Production Gateway | `https://vyraconnect.in/scan?token={qr_token}` |

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
      "status": "ACTIVE",
      "otp_verified": true,
      "vehicles": [
        {
          "id": "v1-uuid",
          "vehicle_type": "Two Wheeler",
          "registration_number": "KL 55 BH 1234",
          "status": "ACTIVE"
        }
      ],
      "emergency_contacts": [
        {
          "id": "e1-uuid",
          "name": "Sarah Doe",
          "relationship": "Father",
          "mobile": "9746910890",
          "is_primary": true
        }
      ]
    }
  }
  ```

---

## 3. Dedicated Emergency Contacts Management API

A dedicated API suite to collect, retrieve, update, and manage emergency contacts for vehicle owners.

### `POST /api/emergency-contacts`
Creates or updates an emergency contact linked to a customer. Supports customer lookup via `customerId`, `customerMobile`, or `qrToken`.

- **Headers**:
  `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "customerId": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
    "customerMobile": "9876543210",
    "qrToken": "ccd818971c98d782321233c390acf88e1f4c8ddebdbddbb82535102f3e34db2d",
    "name": "Robert Doe",
    "relationship": "Father",
    "mobile": "9746910890",
    "is_primary": true,
    "priority": 1
  }
  ```
  *(Note: Only one customer identifier (`customerId`, `customerMobile`, or `qrToken`) is required).*

- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Emergency contact saved successfully",
    "contact": {
      "id": "18f50608-f4cb-4d43-a0e4-539c362955f1",
      "customer_id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
      "name": "Robert Doe",
      "relationship": "Father",
      "mobile": "9746910890",
      "priority": 1,
      "is_primary": true,
      "status": "ACTIVE",
      "created_at": "2026-10-25T17:45:00.000Z",
      "updated_at": "2026-10-25T17:45:00.000Z"
    }
  }
  ```

---

### `GET /api/emergency-contacts`
Retrieves all emergency contacts associated with a customer.

- **Query Parameters**:
  - `?customerId=<UUID>` OR
  - `?customerMobile=9876543210` OR
  - `?qrToken=<hex_token>`

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "customerId": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
    "contacts": [
      {
        "id": "18f50608-f4cb-4d43-a0e4-539c362955f1",
        "customer_id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
        "name": "Robert Doe",
        "relationship": "Father",
        "mobile": "9746910890",
        "priority": 1,
        "is_primary": true,
        "status": "ACTIVE"
      }
    ]
  }
  ```

---

### `GET /api/emergency-contacts/:id`
Retrieves a single emergency contact by ID.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "contact": {
      "id": "18f50608-f4cb-4d43-a0e4-539c362955f1",
      "name": "Robert Doe",
      "relationship": "Father",
      "mobile": "9746910890",
      "is_primary": true,
      "customer": {
        "id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
        "full_name": "Nikhrawo",
        "mobile": "9876543210"
      }
    }
  }
  ```

---

### `PUT /api/emergency-contacts/:id` or `PATCH /api/emergency-contacts/:id`
Updates details of an existing emergency contact.

- **Request Body**:
  ```json
  {
    "name": "Robert Doe",
    "relationship": "Guardian",
    "mobile": "9746910890",
    "is_primary": true
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Emergency contact updated successfully",
    "contact": { ... }
  }
  ```

---

### `DELETE /api/emergency-contacts/:id`
Deletes an emergency contact record.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Emergency contact removed successfully"
  }
  ```

---

## 4. Public Tag Scan & Emergency Registration

### `GET /api/scan/:token`
Public endpoint queried when a physical QR tag is scanned.

- **Path Parameter**: `token` (32-byte hex string)
- **Response States**:
  - `AVAILABLE` / `ASSIGNED`: Tag requires registration and emergency contact setup.
  - `ACTIVE`: Tag is activated with full vehicle profile and 2-way masked call routing.
  - `BLOCKED` / `EXPIRED`: Inactive tag warning.

- **Response `200 OK`**:
  ```json
  {
    "qr": {
      "id": "1d312073-95ff-4dbc-a3e4-06fafcc1c526",
      "qr_serial": "V-000011",
      "status": "ACTIVE",
      "customer": {
        "id": "9ebc5712-bcdf-4a67-9e27-91c2005d7f55",
        "full_name": "Nikhrawo",
        "mobile": "9876543210",
        "vehicles": [
          {
            "id": "v1",
            "registration_number": "KL 55 BH 1234",
            "vehicle_type": "Two Wheeler",
            "status": "ACTIVE"
          }
        ],
        "emergency_contacts": [
          {
            "id": "em-1",
            "name": "Sarah Doe",
            "relationship": "Father",
            "mobile": "9746910890",
            "is_primary": true
          }
        ]
      }
    }
  }
  ```

---

### `POST /api/scan/:token/register`
Self-service activation for unassigned tags with comprehensive owner and emergency contact onboarding.

- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "johndoe@gmail.com",
    "vehicleType": "Four Wheeler",
    "registrationNumber": "KL 55 BH 1234",
    "emergencyName": "Sarah Doe",
    "emergencyRelationship": "Father",
    "emergencyMobile": "9746910890"
  }
  ```

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "QR Code successfully registered and activated",
    "qr": {
      "id": "qr-uuid",
      "status": "ACTIVE",
      "activated_at": "2026-10-25T17:45:00.000Z"
    },
    "customer": {
      "full_name": "John Doe",
      "mobile": "9876543210"
    }
  }
  ```

---

## 5. 2-Way Number Masking & Phone Dialer Gateway

Provides 100% number privacy for both parties (Scanner and Owner / Emergency Contact).
**No unwanted incoming phone callbacks:** Upon registering the masked call session, the system prompts permission and navigates directly to the phone's calling app (`tel:...`) to dial the masked virtual relay.

### `POST /api/call/mask`
Registers a 2-way masked call session and prepares the virtual dialer relay.

- **Request Body**:
  ```json
  {
    "scannerNumber": "9876543210",
    "plateNumber": "KL 55 BH 1234",
    "qrToken": "ccd818971c98d782321233c390acf88e1f4c8ddebdbddbb82535102f3e34db2d",
    "targetType": "emergency",
    "targetName": "Emergency Contact (Father)",
    "targetNumber": "9746910890"
  }
  ```
  *(Note: Set `targetType: "owner"` to call the vehicle owner, or `targetType: "emergency"` to call the emergency contact).*

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "virtualNumber": "09513886363",
    "dialNumber": "+919513886363",
    "scannerMasked": "+91 ••••• ••210",
    "targetMasked": "+91 ••••• ••890",
    "targetType": "emergency",
    "targetName": "Emergency Contact (Father)",
    "plateNumber": "KL 55 BH 1234",
    "message": "Privacy bridge active. Dial 09513886363 to reach Emergency Contact without revealing your number."
  }
  ```

- **Client-Side Dialer Navigation Flow**:
  1. User enters 10-digit mobile number in the modal.
  2. Numbers are masked (`+91 ••••• ••210` and `+91 ••••• ••890`).
  3. Modal displays permission prompt: *"Allow VyraConnect to open your Phone / Contact app?"*
  4. Triggers `window.location.href = "tel:+919513886363"` to open native mobile dialer.
  5. Scanner dials out to the virtual number; neither party sees each other's real phone number.

---

## 6. Architecture & Data Model

```
+--------------------------------------------------------------------+
|                             Customer                               |
| (id, customer_code, full_name, mobile, email, address, status)     |
+---------------------------------+----------------------------------+
                                  |
            +---------------------+---------------------+
            | 1:N                 | 1:N                 | 1:N
            v                     v                     v
+-----------------------+ +-------------------+ +--------------------+
|        QrCode         | |      Vehicle      | |  EmergencyContact  |
| (id, qr_serial,       | | (id, customer_id, | | (id, customer_id,  |
|  qr_token, qr_url,    | |  registration_no, | |  name,             |
|  status)              | |  vehicle_type)    | |  relationship,     |
|                       | |                   | |  mobile,           |
|                       | |                   | |  is_primary)       |
+-----------------------+ +-------------------+ +--------------------+
```
