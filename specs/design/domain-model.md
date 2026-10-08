# Domain model

Customer engagements are requests raised by a requester from a CRM opportunity, typed, and moved through a simple lifecycle.

```mermaid
erDiagram
    ENGAGEMENT {
        string id PK
        string opportunityId "CRM opportunity reference"
        string opportunityName
        string customerName
        string type "one of five customer engagement types"
        string status "open, completed, cancelled"
        date startDate
        date endDate
        string requesterId "signed-in subject"
        string requesterName
        string description
        datetime createdAt
        datetime updatedAt
    }
    ENGAGEMENT_TYPE {
        string code PK
        string name
    }
    ENGAGEMENT_TYPE ||--o{ ENGAGEMENT : classifies
```

The five type names are an open question in F1; the list is held as data so it can be filled in without a contract change.