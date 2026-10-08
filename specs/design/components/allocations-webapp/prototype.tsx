import { useState, type ReactNode } from "react";
import {
  Alert, AppShell, Breadcrumbs, Button, Detail, EmptyState, Field, Filters, Form, Heading, Screen, Section,
  Table, ValidationSummary, defineApp, useCollection, useDisplayState, useNav, useParams,
} from "@wso2/prototype-kit";

interface Engagement {
  id: string;
  opportunityId: string;
  opportunityName: string;
  customerName: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Opportunity { id: string; name: string; customerName: string }

const typeOptions = ["Engagement type 1", "Engagement type 2", "Engagement type 3", "Engagement type 4", "Engagement type 5"];

const engagements: Engagement[] = [
  { id: "eng-1", opportunityId: "opp-1", opportunityName: "Cloud migration", customerName: "Acme Corp", type: "Engagement type 1", status: "open", startDate: "2026-02-03", endDate: "2026-03-12", description: "Move the billing platform to the cloud." },
  { id: "eng-2", opportunityId: "opp-2", opportunityName: "Data platform", customerName: "Globex", type: "Engagement type 2", status: "completed", startDate: "2025-10-01", endDate: "2025-12-19", description: "Build the analytics data platform." },
  { id: "eng-3", opportunityId: "opp-3", opportunityName: "Security review", customerName: "Initech", type: "Engagement type 3", status: "cancelled", startDate: "2026-01-12", endDate: "2026-02-06", description: "Annual security assessment." },
  { id: "eng-4", opportunityId: "opp-4", opportunityName: "API modernisation", customerName: "Umbrella Ltd", type: "Engagement type 4", status: "open", startDate: "2026-01-19", endDate: "2026-04-17", description: "Replace legacy SOAP services." },
];

const opportunities: Opportunity[] = [
  { id: "opp-1", name: "Cloud migration", customerName: "Acme Corp" },
  { id: "opp-2", name: "Data platform", customerName: "Globex" },
  { id: "opp-5", name: "Customer portal", customerName: "Hooli" },
  { id: "opp-6", name: "Integration hub", customerName: "Stark Industries" },
];

const user = { name: "Rita Fernando", email: "rita@acme.example" };

const statusTone = (status: string) =>
  status === "open" ? "info" : status === "completed" ? "success" : "default";

function Shell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      id="shell"
      user={user}
      nav={[{ id: "nav.engagements", label: "My engagements", to: "screen.engagements" }]}
      account="screen.account"
      settings="screen.settings"
      signOut="screen.signed-out"
    >
      {children}
    </AppShell>
  );
}

function Engagements() {
  const state = useDisplayState();
  const all = useCollection<Engagement>("engagements");
  const [status, setStatus] = useState("All");
  const shown = state === "state.empty" ? [] : all.items.filter((e) => status === "All" || e.status === status.toLowerCase());
  return (
    <Shell>
      <Heading
        id="heading.engagements"
        text="My engagements"
        actions={<Button id="btn.raise" label="Raise engagement" emphasis="primary" to="screen.pick-opportunity" />}
      />
      {state === "state.failed" && (
        <Alert id="alert.failed" tone="error" title="Engagements unavailable" text="We could not load your engagements. Try again in a few minutes." />
      )}
      <Section id="section.engagements" title="Engagements" count={shown.length} subtitle="Customer engagements you raised.">
        <Filters id="filters.engagements">
          <Field id="field.status" label="Status" type="select" options={["All", "Open", "Completed", "Cancelled"]} value={status} onChange={setStatus} />
        </Filters>
        <Table
          id="table.engagements"
          columns={["Customer", "Opportunity", "Type", "Dates", { label: "Status", kind: "status" }]}
          rows={shown.map((e) => ({
            id: `engagement.${e.id}`,
            cells: [e.customerName, e.opportunityName, e.type, `${e.startDate} to ${e.endDate}`],
            status: { text: e.status, tone: statusTone(e.status) },
            to: "screen.detail",
            params: { engagement: e.id },
          }))}
          empty={
            <EmptyState
              id="empty.engagements"
              title="No engagements yet"
              text="Raise one from a CRM opportunity."
              actions={<Button id="btn.raise-empty" label="Raise engagement" emphasis="primary" to="screen.pick-opportunity" />}
            />
          }
        />
      </Section>
    </Shell>
  );
}

function PickOpportunity() {
  const state = useDisplayState();
  const all = useCollection<Opportunity>("opportunities");
  const [q, setQ] = useState("");
  const matches = state === "state.empty" ? [] : all.items.filter((o) => `${o.name} ${o.customerName}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.pick"
        items={[
          { id: "crumb.engagements", label: "My engagements", to: "screen.engagements" },
          { id: "crumb.pick", label: "Choose opportunity" },
        ]}
      />
      <Heading id="heading.pick" text="Choose a CRM opportunity" />
      {state === "state.delayed" && (
        <Alert id="alert.delayed" tone="info" title="The CRM is slow to answer" text="Opportunities will appear in a moment." />
      )}
      {state === "state.failed" && (
        <Alert id="alert.crm-failed" tone="error" title="CRM unavailable" text="We could not reach the CRM. Try again shortly." />
      )}
      <Section id="section.opportunities" title="Opportunities" count={matches.length} subtitle="Open an opportunity to raise an engagement from it.">
        <Filters id="filters.opportunities">
          <Field id="field.search" label="Search opportunities" type="text" value={q} onChange={setQ} />
        </Filters>
        <Table
          id="table.opportunities"
          columns={["Opportunity", "Customer"]}
          rows={matches.map((o) => ({
            id: `opportunity.${o.id}`,
            cells: [o.name, o.customerName],
            to: "screen.raise",
            params: { opportunity: o.id },
          }))}
          empty={<EmptyState id="empty.opportunities" title="No opportunities found" text="Try another search." />}
        />
      </Section>
    </Shell>
  );
}

function Raise() {
  const { opportunity: oppId } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const opps = useCollection<Opportunity>("opportunities");
  const all = useCollection<Engagement>("engagements");
  const opp = (oppId ? opps.get(oppId) : undefined) ?? opps.items[0]!;
  const issues = state === "state.validation-error" ? ["Start date is more than 5 days in the past", "Choose an engagement type"] : [];
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.raise"
        items={[
          { id: "crumb.engagements", label: "My engagements", to: "screen.engagements" },
          { id: "crumb.pick", label: "Choose opportunity", to: "screen.pick-opportunity" },
          { id: "crumb.raise", label: "Raise engagement" },
        ]}
      />
      <Heading id="heading.raise" text="Raise engagement" />
      {state === "state.failed" && (
        <Alert id="alert.save-failed" tone="error" title="Could not raise the engagement" text="Nothing was saved. Try again." />
      )}
      <Detail id="detail.opportunity" title="Opportunity" fields={[{ label: "Opportunity", value: opp.name }, { label: "Customer", value: opp.customerName }]} />
      <Form
        id="form.raise"
        title="Engagement details"
        onSubmit={(v) => {
          all.create({
            opportunityId: opp.id,
            opportunityName: opp.name,
            customerName: opp.customerName,
            type: v.type ?? typeOptions[0]!,
            status: "open",
            startDate: v.startDate ?? "2026-01-15",
            endDate: v.endDate ?? "2026-02-15",
            description: v.description ?? "",
          });
          navigate.go("screen.engagements");
        }}
        actions={
          <>
            <Button id="btn.raise-cancel" label="Cancel" to="screen.engagements" />
            <Button id="btn.raise-submit" label="Raise" emphasis="primary" submit />
          </>
        }
      >
        {issues.length > 0 && <ValidationSummary id="summary.raise" issues={issues} />}
        <Field id="field.type" name="type" label="Engagement type" type="select" options={typeOptions} required error={issues.length ? "Choose an engagement type" : undefined} />
        <Field id="field.start" name="startDate" label="Start date" type="date" defaultValue="2026-01-19" required error={issues.length ? "No more than 5 days in the past" : undefined} />
        <Field id="field.end" name="endDate" label="End date" type="date" defaultValue="2026-03-20" required />
        <Field id="field.description" name="description" label="Description" type="textarea" />
      </Form>
    </Shell>
  );
}

function EngagementDetail() {
  const { engagement: id } = useParams();
  const state = useDisplayState();
  const all = useCollection<Engagement>("engagements");
  const e = (id ? all.get(id) : undefined) ?? all.items[0]!;
  const isOpen = e.status === "open";
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.detail"
        items={[
          { id: "crumb.engagements", label: "My engagements", to: "screen.engagements" },
          { id: "crumb.detail", label: e.opportunityName },
        ]}
      />
      <Heading
        id="heading.detail"
        text={e.opportunityName}
        actions={
          <>
            <Button id="btn.edit" label="Edit" disabled={!isOpen} to="screen.edit" params={{ engagement: e.id }} />
            <Button id="btn.complete" label="Complete" emphasis="primary" disabled={!isOpen} onPress={() => all.update(e.id, { status: "completed" })} />
            <Button id="btn.cancel" label="Cancel engagement" emphasis="danger" disabled={!isOpen} onPress={() => all.update(e.id, { status: "cancelled" })} />
          </>
        }
      />
      {state === "state.failed" && (
        <Alert id="alert.update-failed" tone="error" title="Update failed" text="The engagement was not changed. Try again." />
      )}
      {!isOpen && <Alert id="alert.closed" tone="info" text={`This engagement is ${e.status} and can no longer be changed.`} />}
      <Detail
        id="detail.engagement"
        fields={[
          { label: "Customer", value: e.customerName },
          { label: "Opportunity", value: e.opportunityName },
          { label: "Type", value: e.type },
          { label: "Status", value: e.status },
          { label: "Start date", value: e.startDate },
          { label: "End date", value: e.endDate },
          { label: "Description", value: e.description },
        ]}
      />
    </Shell>
  );
}

function EditEngagement() {
  const { engagement: id } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Engagement>("engagements");
  const e = (id ? all.get(id) : undefined) ?? all.items[0]!;
  const issues = state === "state.validation-error" ? ["End date must be after the start date"] : [];
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.edit"
        items={[
          { id: "crumb.engagements", label: "My engagements", to: "screen.engagements" },
          { id: "crumb.detail", label: e.opportunityName, to: "screen.detail", params: { engagement: e.id } },
          { id: "crumb.edit", label: "Edit" },
        ]}
      />
      <Heading id="heading.edit" text="Edit engagement" />
      <Form
        id="form.edit"
        onSubmit={(v) => {
          all.update(e.id, {
            type: v.type ?? e.type,
            startDate: v.startDate ?? e.startDate,
            endDate: v.endDate ?? e.endDate,
            description: v.description ?? e.description,
          });
          navigate.go("screen.detail", { engagement: e.id });
        }}
        actions={
          <>
            <Button id="btn.edit-cancel" label="Cancel" to="screen.detail" params={{ engagement: e.id }} />
            <Button id="btn.edit-save" label="Save" emphasis="primary" submit />
          </>
        }
      >
        {issues.length > 0 && <ValidationSummary id="summary.edit" issues={issues} />}
        <Field id="field.type" name="type" label="Engagement type" type="select" options={typeOptions} defaultValue={e.type} />
        <Field id="field.start" name="startDate" label="Start date" type="date" defaultValue={e.startDate} required />
        <Field id="field.end" name="endDate" label="End date" type="date" defaultValue={e.endDate} required error={issues[0]} />
        <Field id="field.description" name="description" label="Description" type="textarea" defaultValue={e.description} />
      </Form>
    </Shell>
  );
}

function Account() {
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail id="detail.account" fields={[{ label: "Name", value: user.name }, { label: "Email", value: user.email }, { label: "Role", value: "Requester" }]} />
    </Shell>
  );
}

function Settings() {
  const navigate = useNav();
  return (
    <Shell>
      <Heading id="heading.settings" text="Settings" />
      <Form
        id="form.settings"
        onSubmit={() => navigate.go("screen.engagements")}
        actions={<Button id="btn.save-settings" label="Save settings" emphasis="primary" submit />}
      >
        <Field id="field.emails" label="Email me when my engagements change" type="switch" defaultValue="on" />
      </Form>
    </Shell>
  );
}

function SignedOut() {
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to="screen.engagements" />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.engagements": Engagements,
    "screen.pick-opportunity": PickOpportunity,
    "screen.raise": Raise,
    "screen.detail": EngagementDetail,
    "screen.edit": EditEngagement,
    "screen.account": Account,
    "screen.settings": Settings,
    "screen.signed-out": SignedOut,
  },
  data: { engagements, opportunities },
});
