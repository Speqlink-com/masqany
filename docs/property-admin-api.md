# Property Admin Module - API Documentation

## Overview

This document describes the backend API endpoints required to support the Property Admin module in the Masqany mobile application. The module enables property owners and agents to manage their properties, units, analytics, and agents.

**Base URL:** `https://api.masqany.com/v1`

**Authentication:** All endpoints require Bearer token authentication via the `Authorization` header.

---

## Table of Contents

1. [Properties](#properties)
2. [Units](#units)
3. [Analytics](#analytics)
4. [Agents](#agents)
5. [Data Models](#data-models)
6. [Error Responses](#error-responses)

---

## Properties

### Get Properties List

Retrieve a paginated list of properties owned or managed by the authenticated user.

**Endpoint:** `GET /property-admin/properties`

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `pageSize` (integer, optional): Items per page (default: 10, max: 50)
- `type` (string, optional): Filter by property type (bedsitter, 1_bedroom, 2_bedroom, 3_bedroom, 4_bedroom_plus, studio, penthouse)
- `status` (string, optional): Filter by status (active, archived)
- `sortBy` (string, optional): Sort field (name, createdAt, occupancyRate)
- `sortOrder` (string, optional): Sort order (asc, desc)

**Response:** `200 OK`
```json
{
  "properties": [
    {
      "id": "prop-001",
      "name": "Kilimani Heights",
      "type": "2_bedroom",
      "location": {
        "estate": "Kilimani",
        "county": "Nairobi",
        "coordinates": [36.7833, -1.2921]
      },
      "units": {
        "total": 40,
        "occupied": 32,
        "vacant": 6,
        "vacantSoon": 2
      },
      "pricing": {
        "basePrice": 45000,
        "currency": "KES"
      },
      "metadata": {
        "views": 1250,
        "rating": 4.5,
        "amenities": ["parking", "security", "water", "backup_power"]
      },
      "ownership": {
        "ownerId": "user-123",
        "ownerName": "John Doe",
        "ownerRole": "Property_Owner"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-05-20T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Get Single Property

Retrieve detailed information about a specific property.

**Endpoint:** `GET /property-admin/properties/:propertyId`

**Path Parameters:**
- `propertyId` (string, required): Property ID

**Response:** `200 OK`
```json
{
  "id": "prop-001",
  "name": "Kilimani Heights",
  "type": "2_bedroom",
  "location": {
    "estate": "Kilimani",
    "county": "Nairobi",
    "coordinates": [36.7833, -1.2921]
  },
  "units": {
    "total": 40,
    "occupied": 32,
    "vacant": 6,
    "vacantSoon": 2
  },
  "pricing": {
    "basePrice": 45000,
    "currency": "KES"
  },
  "metadata": {
    "views": 1250,
    "rating": 4.5,
    "amenities": ["parking", "security", "water", "backup_power"]
  },
  "ownership": {
    "ownerId": "user-123",
    "ownerName": "John Doe",
    "ownerRole": "Property_Owner"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-05-20T14:22:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Property not found
- `403 Forbidden`: User doesn't have access to this property

---

### Create Property

Create a new property listing.

**Endpoint:** `POST /property-admin/properties`

**Request Body:**
```json
{
  "name": "Westlands Apartments",
  "type": "1_bedroom",
  "location": {
    "estate": "Westlands",
    "county": "Nairobi",
    "coordinates": [36.8097, -1.2676]
  },
  "pricing": {
    "basePrice": 35000,
    "currency": "KES"
  },
  "metadata": {
    "amenities": ["parking", "security", "gym"]
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "prop-006",
  "name": "Westlands Apartments",
  "type": "1_bedroom",
  "location": {
    "estate": "Westlands",
    "county": "Nairobi",
    "coordinates": [36.8097, -1.2676]
  },
  "units": {
    "total": 0,
    "occupied": 0,
    "vacant": 0,
    "vacantSoon": 0
  },
  "pricing": {
    "basePrice": 35000,
    "currency": "KES"
  },
  "metadata": {
    "views": 0,
    "rating": 0,
    "amenities": ["parking", "security", "gym"]
  },
  "ownership": {
    "ownerId": "user-123",
    "ownerName": "John Doe",
    "ownerRole": "Property_Owner"
  },
  "createdAt": "2024-05-23T16:00:00Z",
  "updatedAt": "2024-05-23T16:00:00Z"
}
```

**Error Responses:**
- `422 Unprocessable Entity`: Validation errors

---

### Archive Property

Archive a property (soft delete).

**Endpoint:** `DELETE /property-admin/properties/:propertyId`

**Path Parameters:**
- `propertyId` (string, required): Property ID

**Response:** `200 OK`
```json
{
  "message": "Property archived successfully",
  "propertyId": "prop-001"
}
```

**Error Responses:**
- `404 Not Found`: Property not found
- `403 Forbidden`: User doesn't have permission to archive this property

---

## Units

### Get Property Units

Retrieve all units for a specific property.

**Endpoint:** `GET /property-admin/properties/:propertyId/units`

**Path Parameters:**
- `propertyId` (string, required): Property ID

**Query Parameters:**
- `status` (string, optional): Filter by status (occupied, vacant, vacant_soon)

**Response:** `200 OK`
```json
{
  "units": [
    {
      "id": "unit-001",
      "propertyId": "prop-001",
      "roomNumber": "A101",
      "status": "occupied",
      "details": {
        "floor": 1,
        "bedrooms": 2,
        "bathrooms": 1,
        "squareMeters": 65
      },
      "tenant": {
        "name": "Jane Smith",
        "phone": "+254712345678",
        "moveInDate": "2024-01-01",
        "leaseEndDate": "2024-12-31"
      },
      "pricePerMonth": 45000,
      "metadata": {
        "lastInspection": "2024-05-01",
        "maintenanceStatus": "good"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-05-20T14:22:00Z"
    }
  ],
  "summary": {
    "total": 40,
    "occupied": 32,
    "vacant": 6,
    "vacantSoon": 2
  }
}
```

**Error Responses:**
- `404 Not Found`: Property not found
- `403 Forbidden`: User doesn't have access to this property

---

### Update Unit Status

Update the status of a specific unit.

**Endpoint:** `PATCH /property-admin/properties/:propertyId/units/:unitId/status`

**Path Parameters:**
- `propertyId` (string, required): Property ID
- `unitId` (string, required): Unit ID

**Request Body:**
```json
{
  "status": "vacant",
  "reason": "Tenant moved out",
  "effectiveDate": "2024-05-25"
}
```

**Response:** `200 OK`
```json
{
  "id": "unit-001",
  "propertyId": "prop-001",
  "roomNumber": "A101",
  "status": "vacant",
  "details": {
    "floor": 1,
    "bedrooms": 2,
    "bathrooms": 1,
    "squareMeters": 65
  },
  "tenant": null,
  "pricePerMonth": 45000,
  "metadata": {
    "lastInspection": "2024-05-01",
    "maintenanceStatus": "good",
    "statusChangeReason": "Tenant moved out",
    "statusChangeDate": "2024-05-25"
  },
  "updatedAt": "2024-05-23T16:15:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Property or unit not found
- `422 Unprocessable Entity`: Invalid status transition
- `403 Forbidden`: User doesn't have permission to update this unit

---

## Analytics

### Get Analytics

Retrieve analytics data for the authenticated user's properties.

**Endpoint:** `GET /property-admin/analytics`

**Query Parameters:**
- `period` (string, required): Time period (daily, weekly, monthly, yearly)
- `startDate` (string, optional): Start date (ISO 8601 format)
- `endDate` (string, optional): End date (ISO 8601 format)
- `propertyId` (string, optional): Filter by specific property

**Response:** `200 OK`
```json
{
  "period": "monthly",
  "startDate": "2024-05-01",
  "endDate": "2024-05-31",
  "totalProperties": 5,
  "totalUnits": 164,
  "occupiedUnits": 132,
  "vacantUnits": 28,
  "vacantSoonUnits": 4,
  "occupancyRate": 80.49,
  "totalViews": 5420,
  "totalRevenue": 5940000,
  "revenueByProperty": [
    {
      "propertyId": "prop-001",
      "propertyName": "Kilimani Heights",
      "revenue": 1440000,
      "occupancyRate": 80.0
    }
  ],
  "trends": {
    "occupancyRateChange": 2.5,
    "revenueChange": 150000,
    "viewsChange": 320
  }
}
```

**Error Responses:**
- `422 Unprocessable Entity`: Invalid period or date range

---

## Agents

### Get Agents

Retrieve all agents assigned to the authenticated property owner.

**Endpoint:** `GET /property-admin/agents`

**Query Parameters:**
- `status` (string, optional): Filter by status (active, inactive)

**Response:** `200 OK`
```json
{
  "agents": [
    {
      "id": "agent-001",
      "name": "Michael Johnson",
      "email": "michael.j@masqany.com",
      "phone": "+254722334455",
      "avatar": "https://cdn.masqany.com/avatars/agent-001.jpg",
      "assignedProperties": ["prop-001", "prop-002"],
      "totalProperties": 2,
      "rating": 4.7,
      "hireDate": "2024-01-10",
      "status": "active",
      "metadata": {
        "specialization": "residential",
        "yearsOfExperience": 5
      }
    }
  ],
  "total": 3
}
```

---

### Hire Agent

Assign a new agent to manage properties.

**Endpoint:** `POST /property-admin/agents`

**Request Body:**
```json
{
  "email": "newagent@masqany.com",
  "name": "Sarah Williams",
  "phone": "+254733445566",
  "assignedProperties": ["prop-003"],
  "permissions": ["view_properties", "update_units", "view_analytics"]
}
```

**Response:** `201 Created`
```json
{
  "id": "agent-004",
  "name": "Sarah Williams",
  "email": "newagent@masqany.com",
  "phone": "+254733445566",
  "avatar": null,
  "assignedProperties": ["prop-003"],
  "totalProperties": 1,
  "rating": 0,
  "hireDate": "2024-05-23",
  "status": "active",
  "metadata": {
    "permissions": ["view_properties", "update_units", "view_analytics"]
  }
}
```

**Error Responses:**
- `422 Unprocessable Entity`: Validation errors
- `409 Conflict`: Agent already exists

---

### Remove Agent

Remove an agent's access to properties.

**Endpoint:** `DELETE /property-admin/agents/:agentId`

**Path Parameters:**
- `agentId` (string, required): Agent ID

**Response:** `200 OK`
```json
{
  "message": "Agent removed successfully",
  "agentId": "agent-001"
}
```

**Error Responses:**
- `404 Not Found`: Agent not found
- `403 Forbidden`: User doesn't have permission to remove this agent

---

## Data Models

### Property

```typescript
interface Property {
  id: string;
  name: string;
  type: 'bedsitter' | '1_bedroom' | '2_bedroom' | '3_bedroom' | '4_bedroom_plus' | 'studio' | 'penthouse';
  location: {
    estate: string;
    county: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  units: {
    total: number;
    occupied: number;
    vacant: number;
    vacantSoon: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  metadata: {
    views: number;
    rating: number;
    amenities: string[];
  };
  ownership: {
    ownerId: string;
    ownerName: string;
    ownerRole: 'Property_Owner' | 'Property_Agent';
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Unit

```typescript
interface Unit {
  id: string;
  propertyId: string;
  roomNumber: string;
  status: 'occupied' | 'vacant' | 'vacant_soon';
  details: {
    floor: number;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
  };
  tenant?: {
    name: string;
    phone: string;
    moveInDate: string;
    leaseEndDate: string;
  };
  pricePerMonth: number;
  metadata: {
    lastInspection?: string;
    maintenanceStatus?: string;
    [key: string]: any;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Analytics

```typescript
interface Analytics {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  vacantSoonUnits: number;
  occupancyRate: number; // Percentage
  totalViews: number;
  totalRevenue: number;
  revenueByProperty: Array<{
    propertyId: string;
    propertyName: string;
    revenue: number;
    occupancyRate: number;
  }>;
  trends: {
    occupancyRateChange: number;
    revenueChange: number;
    viewsChange: number;
  };
}
```

### Agent

```typescript
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  assignedProperties: string[];
  totalProperties: number;
  rating: number;
  hireDate: string;
  status: 'active' | 'inactive';
  metadata: {
    specialization?: string;
    yearsOfExperience?: number;
    permissions?: string[];
    [key: string]: any;
  };
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field error (for validation errors)"
    }
  }
}
```

### Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have permission
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

### Error Codes

- `INVALID_REQUEST`: Request format is invalid
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `CONFLICT`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

---

## Authentication

All API requests must include a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The token should be obtained through the authentication flow and represents the authenticated user (property owner or agent).

---

## Rate Limiting

API requests are rate-limited to:
- **100 requests per minute** per user
- **1000 requests per hour** per user

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621234567
```

---

## Pagination

List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 50)

Pagination metadata is included in the response:
```json
{
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## Versioning

The API uses URL versioning. The current version is `v1`.

Base URL: `https://api.masqany.com/v1`

---

## Support

For API support, contact: api-support@masqany.com

**Last Updated:** May 23, 2024
