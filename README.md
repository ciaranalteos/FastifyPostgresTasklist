# Task List API

## GET `/`

- **Purpose**: Fetch all tasks  
- **Parameters**: None

---

## POST `/`

- **Purpose**: Add a new task  
- **Request Body** (JSON):
```json
{
  "task": "Do laundry"
}
```

---

## PATCH `/:id`

- **Purpose**: Toggle the `status` (complete/incomplete) of a task  
- **Route Parameter**:
  - `id`: Task ID (integer)

---

## DELETE `/:id`

- **Purpose**: Delete a task by ID  
- **Route Parameter**:
  - `id`: Task ID (integer)
