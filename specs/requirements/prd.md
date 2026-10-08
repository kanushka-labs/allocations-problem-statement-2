# Allocations App

## Problem Statement

Engagement and delivery teams need consultants on customer engagements, internal work and marketing events, and the allocations team has to clear each consultant with their lead, tell the travel team when a trip is involved, and keep finance informed of who worked on what. Spread across the CRM, HR records, email threads and spreadsheets, requests go astray, double bookings surface late, and finance rebuilds the picture of consultant time by hand every period.

## Solution

One place to raise an engagement request from a CRM opportunity or for internal work, route internal requests through approval, allocate staff and partner consultants onto engagements on a timeline, take each allocation through clearance with the consultant and their lead, notify everyone the lifecycle touches, keep each team's default allocations, and report consultant time with its cost codes.

## Actors

- Requester: raises customer and internal engagement requests, edits them, and tracks, completes or cancels them.
- Approver: approves pending internal engagements and marketing events, correcting them first when needed.
- Allocation manager: allocates consultants to engagements and takes each allocation through clearance.
- Team manager: keeps a team's default allocations current, one at a time or in bulk.
- Finance analyst: reads the dashboard and the consultant allocations report.
- Administrator: maintains access roles, partner consultants and allocation types.
- Consultant: the staff member or partner consultant who is allocated; has no screen in the app and is reached by email.

## Features

- F1 [Customer engagements](features/F1-customer-engagements.md)
- F2 [Internal engagements and marketing events](features/F2-internal-engagements-and-marketing-events.md)
- F3 [Engagement approvals](features/F3-engagement-approvals.md)
- F4 [Consultant allocations](features/F4-consultant-allocations.md)
- F5 [Team allocations](features/F5-team-allocations.md)
- F6 [Dashboard](features/F6-dashboard.md)
- F7 [Consultant allocations report](features/F7-consultant-allocations-report.md)
- F8 [Allocation types](features/F8-allocation-types.md)
- F9 [Partner consultants](features/F9-partner-consultants.md)
- F10 [Access roles](features/F10-access-roles.md)

## Fog

- An Events area of its own: a page address and a hidden menu entry exist with no page behind them, and events live under internal engagements today. \[webapp · src/Config.js:123\]

## Product-wide

Rules that apply to more than one feature, such as sign-in (P1), the requester being copied on every notification (P3) and the past-date limits (P7), are on the [Product-wide](product-wide.md) page.

## Out of Scope

- Consultants using the app: they are notified by email and answer through their lead. *assumed*
- Raising or booking travel; the app only tells the travel team when travel is involved.
- Deleting or renaming an access role, or defining new privileges. \[backend · jwt\_interceptor.bal:362\]

