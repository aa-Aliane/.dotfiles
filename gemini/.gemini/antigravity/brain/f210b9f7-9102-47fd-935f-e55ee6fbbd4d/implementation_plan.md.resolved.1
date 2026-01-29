# Implementation Plan - Backend Features

## Goal Description
Implement missing backend models and API endpoints to support frontend requirements. This includes adding Stock Management (Items, Locations, Suppliers, Orders) to the `tech` app and exposing the existing `repairs` app via API.

## User Review Required
> [!IMPORTANT]
> I will be creating new models. Please review the proposed field names and relationships in the code changes to ensure they match your business logic.

## Proposed Changes

### Tech App (`backend/apps/tech`)

#### Models
Create new models in `backend/apps/tech/models/`:
*   [NEW] `location.py`: `Location` model (name, address, type).
*   [NEW] `supplier.py`: `Supplier` model (name, contact info).
*   [NEW] `stock_item.py`: `StockItem` model (product, location, quantity, serial_number).
*   [NEW] `store_order.py`: `StoreOrder` model (supplier, status, items).
*   [MODIFY] `__init__.py`: Export new models.
*   [MODIFY] `backend/apps/tech/admin.py`: Register `Location`, `Supplier`, `StockItem`, `StoreOrder`.

#### Serializers
Create new serializers in `backend/apps/tech/serializers/`:
*   [NEW] `location_serializer.py`
*   [NEW] `supplier_serializer.py`
*   [NEW] `stock_item_serializer.py`
*   [NEW] `store_order_serializer.py`
*   [MODIFY] `__init__.py`: Export new serializers.

#### Views
Create new viewsets in `backend/apps/tech/views/`:
*   [NEW] `location_viewset.py`
*   [NEW] `supplier_viewset.py`
*   [NEW] `stock_item_viewset.py`
*   [NEW] `store_order_viewset.py`
*   [MODIFY] `__init__.py`: Export new viewsets.

#### URLs
*   [MODIFY] `backend/apps/tech/urls.py`: Register new viewsets with the router.

### Repairs App (`backend/apps/repairs`)

#### Serializers
Create `backend/apps/repairs/serializers/`:
*   [NEW] `repair_serializer.py`: Serializer for `Repair` model.
*   [NEW] `__init__.py`: Export serializer.

#### Views
Create `backend/apps/repairs/views/`:
*   [NEW] `repair_viewset.py`: ViewSet for `Repair` model.
*   [NEW] `__init__.py`: Export viewset.

#### URLs
*   [NEW] `backend/apps/repairs/urls.py`: Register `RepairViewSet`.

### Main Configuration
*   [MODIFY] `backend/conf/urls.py`: Include `repairs.urls`.

## Verification Plan

### Automated Tests
*   Run `python manage.py makemigrations` and `python manage.py migrate` to verify model changes.
*   Run `python manage.py test apps.tech apps.repairs` (if tests exist/are created).

### Manual Verification
*   Use the Browsable API (Swagger/Spectacular) to verify endpoints exist and work:
    *   `/api/tech/locations/`
    *   `/api/tech/suppliers/`
    *   `/api/tech/stock-items/`
    *   `/api/tech/store-orders/`
    *   `/api/repairs/repairs/`
