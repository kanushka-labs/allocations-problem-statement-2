Feature: F1 Customer engagements

  @story-F1.1
  Rule: A requester raises a customer engagement from a CRM opportunity

    Scenario: Raising an engagement from an opportunity
      Given Rita the requester is signed in
      And the CRM has an opportunity "Cloud migration" for "Acme Corp"
      When Rita raises an engagement from "Cloud migration" starting 5 days from today and ending 40 days from today
      Then Rita's engagements include one for "Cloud migration" with status "open"

    @negative
    Scenario: A start date too far in the past is refused
      Given Rita the requester is signed in
      And the CRM has an opportunity "Cloud migration" for "Acme Corp"
      When Rita raises an engagement from "Cloud migration" starting 10 days ago
      Then Rita's engagements do not change

  @story-F1.2
  Rule: Every engagement has one of the five customer engagement types

    Scenario: Choosing a type
      Given Rita the requester is signed in
      And the CRM has an opportunity "Data platform" for "Globex"
      When Rita raises an engagement from "Data platform" with the second listed type
      Then the engagement shows the second listed type

    @negative
    Scenario: An engagement without a type is refused
      Given Rita the requester is signed in
      And the CRM has an opportunity "Data platform" for "Globex"
      When Rita tries to raise an engagement from "Data platform" without choosing a type
      Then Rita's engagements do not change

  @story-F1.3
  Rule: Only the requester may edit their own engagement, and only while it is open

    Scenario: Editing an open engagement
      Given Rita has an open engagement for "Cloud migration"
      When Rita changes its end date to 60 days from today
      Then the engagement ends 60 days from today

    @negative
    Scenario: A completed engagement cannot be edited
      Given Rita has a completed engagement for "Cloud migration"
      When Rita tries to change its end date to 60 days from today
      Then the end date of the engagement is unchanged

    @negative
    Scenario: Another requester cannot edit it
      Given Rita has an open engagement for "Cloud migration"
      When Reza the requester tries to change its end date to 60 days from today
      Then the end date of the engagement is unchanged

  @story-F1.4
  Rule: A requester sees only their own engagements and their status

    Scenario: Tracking my engagements
      Given Rita has an open engagement and a cancelled engagement
      When Rita opens her engagements
      Then she sees both with their statuses

    @negative
    Scenario: Another requester's engagements are not shown
      Given Rita has an open engagement for "Cloud migration"
      When Reza the requester opens his engagements
      Then none of Rita's engagements are listed

  @story-F1.5
  Rule: Only the requester may complete their own engagement

    Scenario: Completing an engagement
      Given Rita has an open engagement for "Cloud migration"
      When Rita completes it
      Then its status is "completed"

    @negative
    Scenario: Another requester cannot complete it
      Given Rita has an open engagement for "Cloud migration"
      When Reza the requester tries to complete it
      Then its status is still "open"

  @story-F1.6
  Rule: Only the requester may cancel their own engagement

    Scenario: Cancelling an engagement
      Given Rita has an open engagement for "Cloud migration"
      When Rita cancels it
      Then its status is "cancelled"

    @negative
    Scenario: Another requester cannot cancel it
      Given Rita has an open engagement for "Cloud migration"
      When Reza the requester tries to cancel it
      Then its status is still "open"
