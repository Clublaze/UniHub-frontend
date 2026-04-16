// Static page — no API calls, no hooks
import { Link } from 'react-router-dom'
import { Separator } from '../../../components/ui/separator'

const ROLES = [
  {
    title:  'Club Lead',
    desc:   'Creates events, submits them for approval, manages members, submits budgets, ECR, and settlement.',
  },
  {
    title:  'Co-Lead',
    desc:   'Can view and manage pending membership applications.',
  },
  {
    title:  'Secretary',
    desc:   'Step 1 approver in the event approval chain. Reviews events and budgets.',
  },
  {
    title:  'Vice President',
    desc:   'Step 2 approver. Can run in parallel with President depending on governance config.',
  },
  {
    title:  'President',
    desc:   'Step 3 approver. Can assign roles to club leads and below. Approves budgets.',
  },
  {
    title:  'Faculty Advisor',
    desc:   'Final approval step. Approves ECR and settlement. Assigns roles at society level.',
  },
  {
    title:  'HOD / Dean',
    desc:   'Highest institutional authority. Approves ECR, full read access, assigns roles at school level.',
  },
]

const FAQ = [
  {
    q: 'My event submission failed with a governance error.',
    a: 'Your club does not have an approval workflow configured. Ask your Faculty Advisor or Admin to set up Governance Config for your club.',
  },
  {
    q: 'Submission says a required role is unfilled.',
    a: 'Someone in the approval chain (e.g. Secretary) has not been assigned for this academic session. Ask an Admin or President to assign that role.',
  },
  {
    q: 'I cannot submit my event even though budget is ready.',
    a: 'The budget must be in APPROVED status, not just SUBMITTED. Wait for the approver to approve your budget first.',
  },
  {
    q: 'I submitted my budget but cannot edit it now.',
    a: 'Budgets are locked once submitted. If it is rejected, you can revise and resubmit.',
  },
  {
    q: 'I do not see the Approvals menu item.',
    a: 'The Approvals page is only visible to approver roles (Secretary, VP, President, Faculty Advisor, HOD, Dean). Club leads do not see it.',
  },
  {
    q: 'How do I leave a club?',
    a: 'Go to Memberships page or the club detail page and click Leave Club.',
  },
  {
    q: 'What happens after an event is approved?',
    a: 'The Club Lead clicks "Mark as Complete" to move the event to ECR Pending status. Then the ECR and Settlement must be submitted and approved before the event is fully closed.',
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Documentation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Everything you need to know about using UniHub.
        </p>
      </div>

      {/* Platform overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">What is UniHub?</h2>
        <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>
            UniHub is a digital governance platform for university clubs and societies.
            It replaces WhatsApp chains and email threads with a structured, tracked,
            and auditable system.
          </p>
          <p>
            Everything that used to happen on paper — event proposals, approval chains,
            budget forms, ECRs — now happens digitally with a full audit trail.
          </p>
        </div>
      </section>

      <Separator />

      {/* Event lifecycle */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Event Lifecycle</h2>
        <div className="rounded-lg border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              ['DRAFT',        'Created, not submitted'],
              ['UNDER REVIEW', 'In the approval chain'],
              ['APPROVED',     'All approvals done'],
              ['ECR PENDING',  'Event happened, awaiting ECR + Settlement'],
              ['CLOSED',       'Fully complete'],
              ['REJECTED',     'Rejected by an approver — can resubmit'],
            ].map(([status, desc], i, arr) => (
              <div key={status} className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-foreground">{status}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-muted-foreground text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Roles */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Roles Explained</h2>
        <div className="space-y-2">
          {ROLES.map(role => (
            <div
              key={role.title}
              className="rounded-lg border bg-card p-4 space-y-1"
            >
              <p className="font-medium text-foreground">{role.title}</p>
              <p className="text-sm text-muted-foreground">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-1">
              <p className="font-medium text-foreground text-sm">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Contact */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Need More Help?</h2>
        <p className="text-sm text-muted-foreground">
          Contact your university administrator or reach out to the UniHub support team.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link to="/audit">
            <span className="text-sm text-primary hover:underline">
              View Audit Panel →
            </span>
          </Link>
          <Link to="/governance">
            <span className="text-sm text-primary hover:underline">
              Governance Config →
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}