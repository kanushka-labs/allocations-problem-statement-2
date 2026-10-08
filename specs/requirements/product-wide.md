# Product-wide

Rules that apply to more than one feature.

## Requirements

- P1 Every user signs in through single sign-on; the app has no passwords of its own. \[org default\] Applies to: all.
- P2 What a user can see and do depends on the access role they hold. Applies to: all. *assumed*
- P3 The requester is copied on every notification about their engagement. Applies to: F1, F2, F3, F4.
- P4 When a trip is involved in an allocation, the travel team is copied on its notifications. Applies to: F4. *assumed*
- P5 A consultant booked on overlapping allocations is flagged when the second is made, not later. Applies to: F4, F5. *assumed*
- P6 Dates in the past are accepted only within a limit; beyond it they are refused. Applies to: F1, F2, F4, F5. *assumed*
- P7 The past-date limit is configured in one place for all features. Applies to: F1, F2, F4, F5. *assumed*

## Decisions

- Engagement requests for customers originate from a CRM opportunity; the CRM is reached as a service the business already holds.