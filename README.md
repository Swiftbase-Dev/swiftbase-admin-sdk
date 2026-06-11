# Swiftbase TypeScript Admin SDK

A robust, type-safe TypeScript Admin SDK for integrating customer backend services with the Swiftbase platform. Supports service authentication, role & service management, customer management, configurations, real-time database querying, and object storage.

## Installation

Install the package via npm:

```bash
npm install swiftbase-admin-sdk
```

---

## Getting Started

### Initialize the SDK

Initialize the SDK at the entry point of your application using your Project ID:

```typescript
import { initializeSdk } from "swiftbase-admin-sdk";

initializeSdk("your-project-id");
```

---

## Authentication

The Admin SDK supports authenticating backend services, managing access tokens, and verifying user or service credentials.

### Service Login (Client Credentials)

Log in as a backend service using a Service ID and Secret Key:

```typescript
import { login } from "swiftbase-admin-sdk";

await login("your-service-id", "your-service-secret");
```

### Verify Credentials

Verify a user token or service token in custom middleware:

```typescript
import { verifyToken, verifyServiceToken } from "swiftbase-admin-sdk";

// Verify a user access token
const user = await verifyToken("user-jwt-token");

// Verify a service token with a specific scope
const service = await verifyServiceToken("service-jwt-token", "admin");
```

### Session Helper Methods

```typescript
import { isLoggedIn, logout, getAccessToken } from "swiftbase-admin-sdk";

if (isLoggedIn()) {
  const token = await getAccessToken();
  console.log("Active Session Access Token:", token);
}

logout(); // Clears access token from the active session
```

---

## Identity & Access Control

Manage roles, services, and user role assignments.

### Role Management

```typescript
import { getRoles, createRole, updateRole, deleteRole } from "swiftbase-admin-sdk";

// Get roles
const roles = await getRoles("your-project-id");

// Create role
const role = await createRole({
  projectId: "your-project-id",
  name: "Manager",
  permissions: ["read:reports", "write:reports"],
});

// Update role
const updatedRole = await updateRole({
  id: "role-id",
  name: "Senior Manager",
});

// Delete role
await deleteRole("role-id");
```

### Service Management

```typescript
import { getServices, createService, updateService, deleteService } from "swiftbase-admin-sdk";

// Get services
const services = await getServices("your-project-id");

// Create service
const newService = await createService({
  projectId: "your-project-id",
  name: "Reporting Engine",
  secretKey: "secure-key",
  scope: ["reports"],
});

// Update service
await updateService({
  id: "service-id",
  name: "Advanced Reporting Engine",
});

// Delete service
await deleteService("service-id");
```

### User Role Assignments

```typescript
import { getUsers, assignRole, unassignRole } from "swiftbase-admin-sdk";

// List all project users
const users = await getUsers("your-project-id");

// Assign a role to a user
await assignRole("user-id", "Manager");

// Unassign a role from a user
await unassignRole("user-id", "Manager");
```

---

## Database Queries

Query your Swiftbase databases using the Query Builder. Query execution automatically utilizes WebSockets if available, otherwise it transparently falls back to REST.

```typescript
import { db } from "swiftbase-admin-sdk";

// Fetch rows
const users = await db("my_database")("users")
  .select("id", "email", "firstName")
  .where("status", "active")
  .limit(10)
  .offset(0);

// Insert row
await db("my_database")("users")
  .insert({ firstName: "Alice", email: "alice@example.com" })
  .execute();

// Update rows
await db("my_database")("users").where("id", "user-id").update({ firstName: "Bob" }).execute();

// Delete rows
await db("my_database")("users").where("id", "user-id").delete().execute();
```

### Real-time Subscriptions

Subscribe to real-time table modifications using WebSockets:

```typescript
const unsubscribe = db("my_database")("posts")
  .where("status", "published")
  .listen((change) => {
    console.log("Change Event:", change.event); // 'insert' | 'update' | 'delete'
    console.log("Changed Data:", change.data);
  });

// To stop listening later:
unsubscribe();
```

---

## Object Storage (S3-Compatible)

Interface with storage buckets using the S3-compatible client.

```typescript
import { Storage } from "swiftbase-admin-sdk";

const storage = new Storage({
  bucket: "my-bucket",
  // accessKeyId: "key",       // Optional: Signs requests with SigV4;
  // secretAccessKey: "secret" // defaults to Bearer token authentication
});

// List files
const { contents } = await storage.listObjects({ prefix: "uploads/" });

// Upload object
await storage.putObject("uploads/hello.txt", "Hello World!", {
  contentType: "text/plain",
});

// Retrieve object text
const text = await storage.getObjectAsText("uploads/hello.txt");

// Delete object
await storage.deleteObject("uploads/hello.txt");
```

---

## Running Tests

Run the Vitest suite locally:

```bash
npm run test
```
