# Frontend Data Migration Walkthrough

This walkthrough documents the migration of the Tek-Mag frontend from mock data to real backend API integration using `@tanstack/react-query`.

## Changes Implemented

### 1. API Client & Interceptors
- **File**: `src/lib/api/client.ts`, `src/lib/api/interceptors.ts`
- **Change**: Configured `axios` with JWT authentication and refresh token logic. Resolved circular dependency issues.

### 2. Type Definitions
- **File**: `src/types/common.ts`, `src/types/product.ts`
- **Change**: Updated TypeScript interfaces to match Django REST Framework serializer outputs.
    - `Repair`: Added optional fields like `status`, `payments`, `deviceType` to match frontend usage.
    - `StockItem`: Added nested `product` details.
    - `Client`: Aligned with `User` model (username, first_name, last_name, profile).

### 3. React Query Hooks
- **File**: `src/hooks/`
- **Change**: Created hooks for fetching and mutating data.
    - `useRepairs`, `useRepair`, `useCreateRepair`, `useUpdateRepair`
    - `useStockItems`, `useUpdateStockItem`
    - `useClients`
    - `useProducts`, `useBrands`, `useDeviceTypes`, `useProductModels`

### 4. Component Integration
- **Repairs Page** (`src/app/(dashboard)/repairs/page.tsx`):
    - Replaced mock data with `useRepairs`.
    - Implemented mutations for:
        - Status changes (`handleStatusChange`)
        - Scheduling (`handleSchedule`)
        - Adding payments (`handleAddPayment`)
        - Marking as recovered (`handleMarkRecovered`)
- **Stock Page** (`src/app/(dashboard)/stock/page.tsx`):
    - Replaced mock data with `useStockItems`.
    - Implemented stock quantity update (`handleAddStock`).
- **Add Reparation Form** (`src/components/add-reparation/add-reparation-form.tsx`):
    - Replaced mock data with `useBrands`, `useDeviceTypes`, `useProductModels`, `useClients`.
    - Fixed type mismatches and logic for dynamic filtering.

## Verification Steps

### 1. Backend Setup
Ensure the Django backend is running:
```bash
cd backend
make run-backend
```

### 2. Frontend Setup
Ensure the Next.js frontend is running:
```bash
cd frontend
npm run dev
```

### 3. Manual Verification

#### Repairs
1.  Navigate to `/repairs`.
2.  Verify the list of repairs loads from the backend.
3.  Click on a repair to view details.
4.  Change the status of a repair (e.g., from "saisie" to "en-cours"). Verify the toast success message and list update.
5.  Add a payment to a repair. Verify the payment totals update.

#### Stock
1.  Navigate to `/stock`.
2.  Verify the list of stock items loads.
3.  Click the "+" button on a stock item to add quantity. Verify the quantity updates.

#### Add Reparation
1.  Navigate to `/add-reparation` (or click "Nouvelle Réparation").
2.  Verify that Device Types, Brands, and Models load from the backend.
3.  Select a client from the search (or create a new one).
4.  Submit the form (Note: `useCreateRepair` integration in the parent page might need final verification if not fully linked yet, but the form component itself is ready).

## Known Limitations
- **Archived Repairs**: Currently empty as the backend endpoint for archived repairs is not yet integrated.
- **Delete Payment**: Not supported by the current backend model (only totals are stored).
