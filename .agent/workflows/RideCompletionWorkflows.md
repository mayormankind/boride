---
description: Wallets and student funds securit
---

# Ride Completion & Confirmation Workflow

## Overview

The ride completion process involves a 2-step confirmation to ensure payment security and prevent driver fraud.

## State Flow

1. **Ongoing** -> **Completion Requested** (Driver Action)
2. **Completion Requested** -> **Completed** (Student Confirmation)
   OR
   **Completion Requested** -> **Disputed** (Student Rejection)

## Detailed Steps

### 1. Driver Requests Completion

- **Where**: Driver App > Active Ride Card > "Complete Ride" button
- **API**: `PUT /driver/rides/:rideId/request-completion`
- **Backend Logic**:
  - Verifies ride is ongoing.
  - Locks wallet funds (for wallet payments).
  - Updates status to `completion_requested`.
  - Logs timeline event.
- **UI State**: Driver sees "Waiting for Confirmation" banner.

### 2. Student Confirmation

- **Where**: Student App (Global Overlay/Drawer)
- **Component**: `RideCompletionConfirmation` (polled via React Query)
- **Trigger**: Detection of any ride with status `completion_requested`.
- **UI**: Blocking drawer showing ride summary and fare.

### 3a. Student Confirms

- **Action**: "Confirm" button
- **API**: `PUT /student/rides/:rideId/confirm` with `{ action: 'confirm' }`
- **Backend Logic**:
  - Deducts funds from student wallet (if locked).
  - Credits driver wallet.
  - Updates status to `completed`.
  - Unlocks wallet lock.
  - Logs `completed` timeline event.

### 3b. Student Disputes

- **Action**: "Dispute" button -> Enter Reason -> Submit
- **API**: `PUT /student/rides/:rideId/confirm` with `{ action: 'reject', reason: '...' }`
- **Backend Logic**:
  - Updates status to `disputed`.
  - Releases wallet lock (funds remain with student but flagged).
  - Logs `disputed` timeline event.
- **Follow-up**: Requires admin intervention (out of scope for automated flow).

## Security Measures

- **Wallet Locking**: Funds are reserved when the driver requests completion to prevent the student from quickly draining their wallet before confirming.
- **Student Authorization**: Only the student can trigger the final fund transfer.
- **Persistence**: The confirmation UI polls the server, so it reappears if the student closes the app and reopens it.
