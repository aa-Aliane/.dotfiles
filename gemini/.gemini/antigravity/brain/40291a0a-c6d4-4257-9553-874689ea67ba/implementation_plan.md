# Implement missing fields for Repairs table

## Goal Description
Expose all required fields (`status`, `brand`, `model`, `deviceType`, `totalCost`, client phone, issues) from the backend so the frontend Repairs table displays complete data.

## Proposed Changes
### Backend
- **Model**: Add `status` field with choices to `apps.repairs.models.Repair`.
- **Serializer**: Extend `RepairSerializer` to include nested client, product model, issues, and derived fields (`totalCost`, `brand`, `model`, `deviceType`).
- **Migrations**: Create and apply migrations for the new `status` field.

### Frontend (no code change needed after backend fixes)
- The existing components will automatically consume the new fields.

## Verification Plan
- Run `python manage.py makemigrations repairs && python manage.py migrate`.
- Start the backend and fetch `/api/repairs/repairs/` via the frontend.
- Verify that the Repairs table now shows status badges, brand/model/device type, total cost, and client phone.
