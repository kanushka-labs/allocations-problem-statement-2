screen MyEngagements "The requester's customer engagements"
  navbar "Allocations"
  sidebar "My engagements -> MyEngagements"
  heading "My engagements"
  row
    search "Search my engagements"
    select "Status: All"
    right
    button "Raise engagement" primary -> PickOpportunity
  table "Customer | Opportunity | Type | Dates | Status" -> EngagementDetail
    row "Acme Corp | Cloud migration | Type A | 03 Nov - 12 Dec | Open"
    row "Globex | Data platform | Type B | 01 Oct - 30 Oct | Completed"

screen PickOpportunity "Choose the CRM opportunity to raise from"
  navbar "Allocations"
  sidebar "My engagements -> MyEngagements"
  heading "Raise engagement"
  search "Search CRM opportunities"
  table "Opportunity | Customer" -> RaiseEngagement
    row "Cloud migration | Acme Corp"
    row "Data platform | Globex"
  row
    right
    button "Cancel" -> MyEngagements

screen RaiseEngagement "Type, dates and notes for the new engagement"
  navbar "Allocations"
  sidebar "My engagements -> MyEngagements"
  heading "Raise engagement"
  text "Opportunity: Cloud migration - Acme Corp"
  select "Engagement type"
  row
    input "Start date"
    input "End date"
  textarea "Description"
  row
    right
    button "Cancel" -> MyEngagements
    button "Raise" primary -> MyEngagements

screen EngagementDetail "One engagement with its actions"
  navbar "Allocations"
  sidebar "My engagements -> MyEngagements"
  breadcrumb "My engagements / Cloud migration"
  heading "Cloud migration"
  badge "Open" info
  card "Details"
    text "Customer: Acme Corp"
    text "Type: Type A"
    text "Dates: 03 Nov - 12 Dec"
  row
    button "Edit" -> EditEngagement
    button "Complete" success -> MyEngagements
    button "Cancel engagement" danger -> MyEngagements

screen EditEngagement "Edit an open engagement"
  navbar "Allocations"
  sidebar "My engagements -> MyEngagements"
  heading "Edit engagement"
  select "Engagement type"
  row
    input "Start date"
    input "End date"
  textarea "Description"
  row
    right
    button "Cancel" -> EngagementDetail
    button "Save" primary -> EngagementDetail

flow "Raise and manage engagements"
  role "Requester"
  description "A requester raises an engagement from a CRM opportunity, then edits or completes it"
  MyEngagements
  PickOpportunity
  RaiseEngagement
  EngagementDetail
  EditEngagement
