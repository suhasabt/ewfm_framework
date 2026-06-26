import { useMemo, useState } from 'react'
import {
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Mail,
  Presentation,
  Search,
  Send,
  Settings,
  Upload,
  X,
} from 'lucide-react'
import beeforceLogo from '@/assets/logos/beeforce-product-logo.png'
import { frameworkItems, frameworkModules } from '@/data/ewfmFramework'

type Persona = 'CFO' | 'CHRO' | 'CDO' | 'HR Digital'
type ContactStatus = 'Sent' | 'Opened' | 'In Progress' | 'Completed' | 'Report Viewed' | 'Outreach Sent'
type AdminView = 'dispatch' | 'campaigns' | 'tracker' | 'reports' | 'pipeline' | 'settings'
type Overlay = 'report' | 'outreach' | 'deck' | null
type TrackerFilters = {
  campaign: string
  persona: string
  industry: string
  status: string
  owner: string
}

type Contact = {
  id: number
  name: string
  company: string
  persona: Persona
  designation: string
  email: string
  mobile: string
  industry: string
  campaign: string
  owner: string
  status: ContactStatus
  score: number
  lastActivity: string
  sentAgo: string
  action: string
  moduleScores: Record<string, number>
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: 'Ritika Mehra',
    company: 'Apex Auto Components',
    persona: 'CFO',
    designation: 'Chief Financial Officer',
    email: 'ritika.mehra@apexauto.example',
    mobile: '+91 98765 12001',
    industry: 'Manufacturing',
    campaign: 'Manufacturing EWFM Assessment - June 2026',
    owner: 'Ananya Rao',
    status: 'Completed',
    score: 72,
    lastActivity: 'Jun 12, 10:52 AM',
    sentAgo: '14 days ago',
    action: 'Create compliance + payroll outreach',
    moduleScores: {
      'Vendor Management': 75,
      'Workforce Onboarding': 62,
      'Workforce Core Management': 88,
      'Workforce Exit & Offboarding': 50,
      'Attendance & Time Management': 80,
      'Predictive Workforce Analytics': 40,
      'Payroll & Payout Management': 55,
      'Compliance Management': 34,
      'Grievance Management': 60,
      'Workforce Communication': 70,
    },
  },
  {
    id: 2,
    name: 'Sameer Iyer',
    company: 'Northstar Retail',
    persona: 'CHRO',
    designation: 'Chief Human Resources Officer',
    email: 'sameer.iyer@northstar.example',
    mobile: '+91 98765 12002',
    industry: 'Retail',
    campaign: 'Retail Workforce Benchmark - June 2026',
    owner: 'Karan Shah',
    status: 'In Progress',
    score: 48,
    lastActivity: 'Jun 25, 4:18 PM',
    sentAgo: '5 days ago',
    action: 'Send resume reminder',
    moduleScores: {
      'Vendor Management': 55,
      'Workforce Onboarding': 42,
      'Workforce Core Management': 52,
      'Workforce Exit & Offboarding': 38,
      'Attendance & Time Management': 66,
      'Predictive Workforce Analytics': 28,
      'Payroll & Payout Management': 44,
      'Compliance Management': 46,
      'Grievance Management': 35,
      'Workforce Communication': 56,
    },
  },
  {
    id: 3,
    name: 'Nisha Kapoor',
    company: 'Finaxis Services',
    persona: 'CDO',
    designation: 'Chief Digital Officer',
    email: 'nisha.kapoor@finaxis.example',
    mobile: '+91 98765 12003',
    industry: 'BFSI',
    campaign: 'BFSI EWFM Digital Readiness - June 2026',
    owner: 'Ananya Rao',
    status: 'Report Viewed',
    score: 81,
    lastActivity: 'Jun 24, 11:03 AM',
    sentAgo: '9 days ago',
    action: 'Book analytics-led demo',
    moduleScores: {
      'Vendor Management': 84,
      'Workforce Onboarding': 78,
      'Workforce Core Management': 90,
      'Workforce Exit & Offboarding': 74,
      'Attendance & Time Management': 86,
      'Predictive Workforce Analytics': 58,
      'Payroll & Payout Management': 82,
      'Compliance Management': 76,
      'Grievance Management': 72,
      'Workforce Communication': 88,
    },
  },
  {
    id: 4,
    name: 'Arvind Narain',
    company: 'HelioTech Systems',
    persona: 'HR Digital',
    designation: 'HR Digital Officer',
    email: 'arvind.narain@heliotech.example',
    mobile: '+91 98765 12004',
    industry: 'IT',
    campaign: 'IT Services Automation Maturity - June 2026',
    owner: 'Maya Sen',
    status: 'Opened',
    score: 0,
    lastActivity: 'Jun 26, 9:28 AM',
    sentAgo: '2 days ago',
    action: 'Send getting-started WhatsApp',
    moduleScores: Object.fromEntries(frameworkModules.map((module, index) => [module, [38, 44, 52, 60, 32, 48, 41, 36, 50, 57][index]])),
  },
  {
    id: 5,
    name: 'Farah Khan',
    company: 'Greenline Foods',
    persona: 'CFO',
    designation: 'Chief Financial Officer',
    email: 'farah.khan@greenline.example',
    mobile: '+91 98765 12005',
    industry: 'FMCG',
    campaign: 'Manufacturing EWFM Assessment - June 2026',
    owner: 'Karan Shah',
    status: 'Sent',
    score: 0,
    lastActivity: 'Jun 23, 2:40 PM',
    sentAgo: '3 days ago',
    action: 'Send alternate-channel reminder',
    moduleScores: Object.fromEntries(frameworkModules.map((module, index) => [module, [50, 48, 65, 40, 58, 30, 46, 35, 42, 54][index]])),
  },
]

const stageOrder: ContactStatus[] = ['Sent', 'Opened', 'In Progress', 'Completed', 'Report Viewed', 'Outreach Sent']

const answerOptions = [
  {
    value: 0,
    label: 'Not Available',
    idleClass: 'border-red-300 text-slate-700 hover:bg-red-50',
    activeClass: 'border-red-600 bg-red-600 text-white ring-2 ring-red-200',
  },
  {
    value: 1,
    label: 'Partially Available',
    idleClass: 'border-yellow-300 text-slate-700 hover:bg-yellow-50',
    activeClass: 'border-yellow-500 bg-yellow-500 text-white ring-2 ring-yellow-200',
  },
  {
    value: 2,
    label: 'Fully Available',
    idleClass: 'border-emerald-300 text-slate-700 hover:bg-emerald-50',
    activeClass: 'border-emerald-600 bg-emerald-600 text-white ring-2 ring-emerald-200',
  },
]

const navItems: Array<{ id: AdminView; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dispatch', label: 'Bulk Dispatch', icon: Upload },
  { id: 'campaigns', label: 'Campaign Detail', icon: LayoutDashboard },
  { id: 'tracker', label: 'Assessment Tracker', icon: ClipboardCheck },
  { id: 'reports', label: 'Completed Reports', icon: FileText },
  { id: 'pipeline', label: 'Sales Pipeline', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const uploadRows = [
  ['Apex Auto Components', 'Ritika Mehra', 'CFO', 'Manufacturing', 'Valid'],
  ['Northstar Retail', 'Sameer Iyer', 'CHRO', 'Retail', 'Valid'],
  ['Finaxis Services', 'Nisha Kapoor', 'CDO', 'BFSI', 'Valid'],
  ['Duplicate contact', 'Priya Menon', 'Finance Head', 'Manufacturing', 'Duplicate'],
  ['Missing mobile', 'Rahul Das', 'HR Digital Officer', 'Unknown', 'Needs fixing'],
]

function scoreLevel(score: number) {
  if (score >= 81) return 'Level 5 - Best-in-Class'
  if (score >= 61) return 'Level 4 - Integrated'
  if (score >= 41) return 'Level 3 - Process Driven'
  if (score >= 21) return 'Level 2 - Basic Digitalization'
  return 'Level 1 - Manual & Reactive'
}

function riskFor(score: number) {
  if (score < 45) return { label: 'High', className: 'bg-red-50 text-red-700 ring-red-200' }
  if (score < 70) return { label: 'Medium', className: 'bg-amber-50 text-amber-700 ring-amber-200' }
  return { label: 'Low', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }
}

function scoreCardTone(score: number) {
  if (score < 45) return 'bg-red-700 text-white'
  if (score < 70) return 'bg-amber-500 text-white'
  return 'bg-emerald-700 text-white'
}

function scoreTextTone(score: number) {
  if (score < 45) return 'text-red-700'
  if (score < 70) return 'text-amber-700'
  return 'text-emerald-700'
}

function scoreFillTone(score: number) {
  if (score < 45) return 'bg-red-500'
  if (score < 70) return 'bg-amber-400'
  return 'bg-emerald-500'
}

function weakestModules(contact: Contact) {
  return Object.entries(contact.moduleScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
}

function completedStatus(status: ContactStatus) {
  return status === 'Completed' || status === 'Report Viewed' || status === 'Outreach Sent'
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort()
}

function matchesSearch(contact: Contact, query: string) {
  const text = `${contact.name} ${contact.company} ${contact.persona} ${contact.industry} ${contact.campaign} ${contact.owner} ${contact.status}`.toLowerCase()
  return text.includes(query.toLowerCase())
}

function filterContacts(contactList: Contact[], query: string, filters?: Partial<TrackerFilters>) {
  return contactList.filter((contact) => {
    if (query && !matchesSearch(contact, query)) return false
    if (filters?.campaign && contact.campaign !== filters.campaign) return false
    if (filters?.persona && contact.persona !== filters.persona) return false
    if (filters?.industry && contact.industry !== filters.industry) return false
    if (filters?.status && contact.status !== filters.status) return false
    if (filters?.owner && contact.owner !== filters.owner) return false
    return true
  })
}

function App() {
  const isAssessment = window.location.pathname.startsWith('/assess/')

  if (isAssessment) {
    return <AssessmentExperience />
  }

  return <AdminApp />
}

function AdminApp() {
  const [view, setView] = useState<AdminView>('dispatch')
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(initialContacts[0])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [stageFilter, setStageFilter] = useState<ContactStatus | 'All'>('All')
  const [adminNotice, setAdminNotice] = useState('Ready')

  const activeContacts = useMemo(() => {
    if (stageFilter === 'All') return contacts
    return contacts.filter((contact) => contact.status === stageFilter)
  }, [stageFilter])

  const openAccount = (contact: Contact) => {
    setSelectedContact(contact)
    setDrawerOpen(true)
  }

  const updateContactStatus = (contact: Contact, status: ContactStatus, action: string) => {
    const updated = { ...contact, status, action, lastActivity: 'Just now' }
    setContacts((current) => current.map((item) => (item.id === contact.id ? updated : item)))
    setSelectedContact(updated)
    setAdminNotice(`${action}: ${contact.name} at ${contact.company}`)
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <img src={beeforceLogo} alt="BeeForce" className="h-9 object-contain" />
        </div>
        <nav className="space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id)
                  setStageFilter('All')
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold ${
                  view === item.id ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-4">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase text-slate-500">BDR Owner</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Ananya Rao</p>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <Topbar />
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {adminNotice !== 'Ready' && (
            <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950">
              {adminNotice}
            </div>
          )}
          {view === 'dispatch' && <BulkDispatch onCreate={() => { setView('campaigns'); setAdminNotice('Campaign generated with tokenized links for 3 valid contacts') }} />}
          {view === 'campaigns' && (
            <CampaignDetail
              allContacts={contacts}
              contacts={activeContacts}
              filter={stageFilter}
              onFilter={setStageFilter}
              onOpenAccount={openAccount}
              onAction={updateContactStatus}
              onOpenReport={(contact) => { setSelectedContact(contact); setOverlay('report') }}
              onOpenOutreach={(contact) => { setSelectedContact(contact); setOverlay('outreach') }}
              onOpenDeck={(contact) => { setSelectedContact(contact); setOverlay('deck') }}
            />
          )}
          {view === 'tracker' && (
            <AssessmentTracker
              contacts={contacts}
              onOpenAccount={openAccount}
              onAction={updateContactStatus}
              onOpenReport={(contact) => { setSelectedContact(contact); setOverlay('report') }}
              onOpenOutreach={(contact) => { setSelectedContact(contact); setOverlay('outreach') }}
              onOpenDeck={(contact) => { setSelectedContact(contact); setOverlay('deck') }}
            />
          )}
          {view === 'reports' && <CompletedReports contacts={contacts.filter((contact) => completedStatus(contact.status))} onOpenAccount={openAccount} onOpenReport={(contact) => { setSelectedContact(contact); setOverlay('report') }} onOutreach={(contact) => { setSelectedContact(contact); setOverlay('outreach') }} />}
          {view === 'pipeline' && (
            <Pipeline
              contacts={contacts}
              onOpenAccount={openAccount}
              onAction={updateContactStatus}
              onOpenReport={(contact) => { setSelectedContact(contact); setOverlay('report') }}
              onOpenOutreach={(contact) => { setSelectedContact(contact); setOverlay('outreach') }}
              onOpenDeck={(contact) => { setSelectedContact(contact); setOverlay('deck') }}
            />
          )}
          {view === 'settings' && <SettingsView />}
        </div>
      </main>

      {drawerOpen && selectedContact && (
        <AccountDrawer
          contact={selectedContact}
          onClose={() => setDrawerOpen(false)}
          onReport={() => setOverlay('report')}
          onOutreach={() => setOverlay('outreach')}
          onDeck={() => setOverlay('deck')}
        />
      )}

      {overlay && selectedContact && (
        <FullscreenOverlay title={overlayTitle(overlay)} onClose={() => setOverlay(null)}>
          {overlay === 'report' && <ReportDetail contact={selectedContact} onOutreach={() => setOverlay('outreach')} onDeck={() => setOverlay('deck')} />}
          {overlay === 'outreach' && <OutreachBuilder contact={selectedContact} />}
          {overlay === 'deck' && <DeckBuilder contact={selectedContact} />}
        </FullscreenOverlay>
      )}
    </div>
  )
}

function overlayTitle(overlay: Overlay) {
  if (overlay === 'report') return 'Report Detail'
  if (overlay === 'outreach') return 'Create Outreach'
  return 'Build PPT Deck'
}

function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand">EWFM Maturity Intelligence</p>
          <h1 className="text-lg font-bold text-slate-950">Consulting-led assessment to sales cycle</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 sm:flex">
            <Search size={16} />
            Search accounts
          </button>
          <button className="rounded-md border border-slate-200 bg-white p-2 text-slate-600">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

function BulkDispatch({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="space-y-5">
      <PageHeader eyebrow="Create Campaign" title="Bulk dispatch with AI validation" description="Upload prospects, validate rows, configure delivery, and generate tokenized assessment links." />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold">Upload prospect sheet</h2>
              <p className="mt-1 text-sm text-slate-500">Expected columns: company, contact, designation, email, mobile, industry, owner.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-white">
              <FileSpreadsheet size={16} />
              Select Excel
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {['Company', 'Contact', 'Persona', 'Industry', 'AI status', 'Action'].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-bold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {uploadRows.map((row) => (
                  <tr key={`${row[0]}-${row[1]}`}>
                    {row.map((cell, index) => (
                      <td key={cell} className="px-4 py-3">
                        {index === 4 ? <ValidationBadge status={cell} /> : <span className="font-medium text-slate-700">{cell}</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button className="text-sm font-bold text-brand">{row[4] === 'Valid' ? 'Use row' : 'Fix inline'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel>
          <h2 className="text-base font-bold">Configure campaign</h2>
          <div className="mt-5 space-y-4">
            <Field label="Campaign name" value="Manufacturing EWFM Assessment - June 2026" />
            <Segment label="Channel" options={['Email', 'WhatsApp', 'Both']} active="Both" />
            <Segment label="Schedule" options={['Send now', 'Monday 9 AM', 'Custom']} active="Monday 9 AM" />
            <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase text-blue-700">Personalization preview</p>
              <p className="mt-2 text-sm text-blue-950">Hi Ritika, BeeForce prepared a 10-minute EWFM maturity benchmark for Apex Auto Components. Your CFO report will quantify compliance, payroll, and contractor spend exposure.</p>
            </div>
            <button onClick={onCreate} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold text-white">
              <Send size={17} />
              Generate Campaign
            </button>
          </div>
        </Panel>
      </div>
    </section>
  )
}

function CampaignDetail({
  allContacts,
  contacts,
  filter,
  onFilter,
  onOpenAccount,
  onAction,
  onOpenReport,
  onOpenOutreach,
  onOpenDeck,
}: {
  allContacts: Contact[]
  contacts: Contact[]
  filter: ContactStatus | 'All'
  onFilter: (filter: ContactStatus | 'All') => void
  onOpenAccount: (contact: Contact) => void
  onAction: (contact: Contact, status: ContactStatus, action: string) => void
  onOpenReport: (contact: Contact) => void
  onOpenOutreach: (contact: Contact) => void
  onOpenDeck: (contact: Contact) => void
}) {
  const [query, setQuery] = useState('')
  const visibleContacts = filterContacts(contacts, query)
  const totalSent = Math.max(allContacts.length, 1)

  return (
    <section className="space-y-5">
      <PageHeader eyebrow="Campaign Detail" title="Manufacturing EWFM Assessment - June 2026" description="Funnel tracking, per-contact actions, and drawer-based drill-downs." />
      <Panel>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-1">
            <button onClick={() => onFilter('All')} className={`rounded px-3 py-2 text-sm font-bold ${filter === 'All' ? 'bg-brand text-white' : 'text-slate-600'}`}>All contacts</button>
          </div>
          <label className="relative block lg:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this campaign" className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-700" />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-6">
          {stageOrder.map((stage) => {
            const count = allContacts.filter((contact) => contact.status === stage).length
            return (
              <button key={stage} onClick={() => onFilter(filter === stage ? 'All' : stage)} className={`rounded-md border p-4 text-left ${filter === stage ? 'border-brand bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <p className="text-xs font-bold uppercase text-slate-500">{stage}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{count}</p>
                <p className="text-xs font-semibold text-slate-500">{Math.round((count / totalSent) * 100)}% of sent</p>
              </button>
            )
          })}
        </div>
      </Panel>
      <ContactTable contacts={visibleContacts} onOpenAccount={onOpenAccount} onAction={onAction} onOpenReport={onOpenReport} onOpenOutreach={onOpenOutreach} onOpenDeck={onOpenDeck} />
    </section>
  )
}

function AssessmentTracker({
  contacts,
  onOpenAccount,
  onAction,
  onOpenReport,
  onOpenOutreach,
  onOpenDeck,
}: {
  contacts: Contact[]
  onOpenAccount: (contact: Contact) => void
  onAction: (contact: Contact, status: ContactStatus, action: string) => void
  onOpenReport: (contact: Contact) => void
  onOpenOutreach: (contact: Contact) => void
  onOpenDeck: (contact: Contact) => void
}) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<TrackerFilters>({ campaign: '', persona: '', industry: '', status: '', owner: '' })
  const visibleContacts = filterContacts(contacts, query, filters)
  const filterConfigs = [
    { key: 'campaign', label: 'Campaign', options: uniqueValues(contacts.map((contact) => contact.campaign)) },
    { key: 'persona', label: 'Persona', options: uniqueValues(contacts.map((contact) => contact.persona)) },
    { key: 'industry', label: 'Industry', options: uniqueValues(contacts.map((contact) => contact.industry)) },
    { key: 'status', label: 'Status', options: uniqueValues(contacts.map((contact) => contact.status)) },
    { key: 'owner', label: 'BDR Owner', options: uniqueValues(contacts.map((contact) => contact.owner)) },
  ] as const

  return (
    <section className="space-y-5">
      <PageHeader eyebrow="Assessment Tracker" title="All campaigns and contacts" description="Global view across campaigns with filters and bulk nudges." />
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(5,1fr)_auto]">
          <label className="relative block">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all contacts" className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-700" />
          </label>
          {filterConfigs.map((config) => (
            <select
              key={config.key}
              value={filters[config.key]}
              onChange={(event) => setFilters((current) => ({ ...current, [config.key]: event.target.value }))}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <option value="">{config.label}</option>
              {config.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ))}
          <button onClick={() => { setQuery(''); setFilters({ campaign: '', persona: '', industry: '', status: '', owner: '' }) }} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">Clear</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={visibleContacts.length === 0}
            onClick={() => visibleContacts.forEach((contact) => !completedStatus(contact.status) && onAction(contact, contact.status, 'Bulk reminder queued'))}
            className="rounded-md bg-brand px-3 py-2 text-sm font-bold text-white disabled:bg-slate-300"
          >
            Bulk reminder to filtered list
          </button>
          <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">{visibleContacts.length} matching contacts</span>
        </div>
      </Panel>
      <ContactTable contacts={visibleContacts} onOpenAccount={onOpenAccount} onAction={onAction} onOpenReport={onOpenReport} onOpenOutreach={onOpenOutreach} onOpenDeck={onOpenDeck} />
    </section>
  )
}

function CompletedReports({ contacts, onOpenAccount, onOpenReport, onOutreach }: { contacts: Contact[]; onOpenAccount: (contact: Contact) => void; onOpenReport: (contact: Contact) => void; onOutreach: (contact: Contact) => void }) {
  const [query, setQuery] = useState('')
  const visibleContacts = filterContacts(contacts, query)

  return (
    <section className="space-y-5">
      <PageHeader eyebrow="Completed Reports" title="Report queue" description="Open reports as overlays without losing the originating table context." />
      <Panel>
        <label className="relative mb-4 block max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search completed reports" className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-700" />
        </label>
        <div className="overflow-hidden rounded-md border border-slate-200">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{['Company', 'Persona', 'Score', 'Maturity', 'Top risk', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3 font-bold">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-4 py-3">
                    <button onClick={() => onOpenAccount(contact)} className="font-bold text-slate-950 hover:text-brand">{contact.company}</button>
                    <p className="text-xs text-slate-500">{contact.name}</p>
                  </td>
                  <td className="px-4 py-3"><PersonaBadge persona={contact.persona} /></td>
                  <td className="px-4 py-3 font-black">{contact.score}%</td>
                  <td className="px-4 py-3 text-slate-600">{scoreLevel(contact.score)}</td>
                  <td className="px-4 py-3 text-slate-600">{weakestModules(contact)[0][0]}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => onOpenReport(contact)} className="rounded-md bg-brand px-3 py-2 text-xs font-bold text-white">Open Report</button>
                      <button onClick={() => onOutreach(contact)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Outreach</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}

function Pipeline({
  contacts,
  onOpenAccount,
  onAction,
  onOpenReport,
  onOpenOutreach,
  onOpenDeck,
}: {
  contacts: Contact[]
  onOpenAccount: (contact: Contact) => void
  onAction: (contact: Contact, status: ContactStatus, action: string) => void
  onOpenReport: (contact: Contact) => void
  onOpenOutreach: (contact: Contact) => void
  onOpenDeck: (contact: Contact) => void
}) {
  const columns = [
    { label: 'Needs Nudge', contacts: contacts.filter((contact) => !completedStatus(contact.status)) },
    { label: 'Assessed', contacts: contacts.filter((contact) => contact.status === 'Completed') },
    { label: 'Outreach Ready', contacts: contacts.filter((contact) => contact.status === 'Report Viewed') },
    { label: 'Sales Follow-up', contacts: contacts.filter((contact) => contact.status === 'Outreach Sent') },
  ]

  return (
    <section className="space-y-5">
      <PageHeader eyebrow="Sales Pipeline" title="Assessment-led deal movement" description="Rows still open Account 360 in a drawer, preserving pipeline context." />
      <Panel>
        <div className="grid gap-3 lg:grid-cols-4">
          {[
            ['Automatic events', 'Sent -> Opened -> In Progress -> Completed moves from delivery, link, answer, and submit events.'],
            ['AI-enabled guidance', 'AI decides the suggested nudge, weak-module talk track, outreach copy, and deck emphasis.'],
            ['Admin override', 'BDR can resend, mark opened, mark viewed, or mark outreach sent when activity happens outside the tool.'],
            ['Current prototype', 'Buttons simulate backend events; a production build would update these statuses from integrations.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase text-brand">{title}</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">{description}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <Panel key={column.label}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">{column.label}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">{column.contacts.length}</span>
            </div>
            <div className="space-y-3">
              {column.contacts.map((contact) => (
                <div key={`${column.label}-${contact.id}`} className="rounded-md border border-slate-200 bg-white p-3">
                  <button onClick={() => onOpenAccount(contact)} className="w-full text-left">
                    <p className="font-bold text-slate-950">{contact.company}</p>
                    <p className="mt-1 text-xs text-slate-500">{contact.persona} | {contact.industry} | {contact.status}</p>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-brand" style={{ width: `${Math.max(contact.score, 36)}%` }} />
                    </div>
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => onOpenAccount(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">360</button>
                    <PipelineActions contact={contact} onAction={onAction} onOpenReport={onOpenReport} onOpenOutreach={onOpenOutreach} onOpenDeck={onOpenDeck} />
                  </div>
                </div>
              ))}
              {column.contacts.length === 0 && <p className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-500">No contacts in this stage.</p>}
            </div>
          </Panel>
        ))}
      </div>
    </section>
  )
}

function PipelineActions({
  contact,
  onAction,
  onOpenReport,
  onOpenOutreach,
  onOpenDeck,
}: {
  contact: Contact
  onAction: (contact: Contact, status: ContactStatus, action: string) => void
  onOpenReport: (contact: Contact) => void
  onOpenOutreach: (contact: Contact) => void
  onOpenDeck: (contact: Contact) => void
}) {
  if (contact.status === 'Sent') {
    return (
      <>
        <button onClick={() => onAction(contact, 'Sent', 'Link resent')} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Resend</button>
        <button onClick={() => onAction(contact, 'Opened', 'Marked opened')} className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-white">Mark opened</button>
      </>
    )
  }

  if (contact.status === 'Opened') {
    return (
      <>
        <button onClick={() => onAction(contact, 'Opened', 'Reminder sent')} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Reminder</button>
        <button onClick={() => onAction(contact, 'In Progress', 'Marked started')} className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-white">Mark started</button>
      </>
    )
  }

  if (contact.status === 'In Progress') {
    return (
      <>
        <button onClick={() => onAction(contact, 'In Progress', 'Resume reminder sent')} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Reminder</button>
        <button onClick={() => onAction(contact, 'Completed', 'Assessment completed')} className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-white">Complete</button>
      </>
    )
  }

  if (contact.status === 'Completed') {
    return (
      <>
        <button onClick={() => onOpenReport(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Report</button>
        <button onClick={() => onAction(contact, 'Report Viewed', 'Report viewed')} className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-white">Mark viewed</button>
      </>
    )
  }

  if (contact.status === 'Report Viewed') {
    return (
      <>
        <button onClick={() => onOpenOutreach(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Outreach</button>
        <button onClick={() => onOpenDeck(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">PPT</button>
        <button onClick={() => onAction(contact, 'Outreach Sent', 'Outreach sent')} className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-white">Mark sent</button>
      </>
    )
  }

  return (
    <>
      <button onClick={() => onOpenReport(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Report</button>
      <button onClick={() => onOpenOutreach(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">Outreach</button>
      <button onClick={() => onOpenDeck(contact)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700">PPT</button>
    </>
  )
}

function SettingsView() {
  return (
    <section className="space-y-5">
      <PageHeader eyebrow="Settings" title="Delivery, white-label, and automation controls" description="Configuration options from the product flow." />
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ['Assessment expiry', '30 days', 'Expired links ask the recipient to contact the BDR.'],
          ['Report delivery', 'Auto-email enabled', 'Persona receives the instant report after completion.'],
          ['White-label output', 'BeeForce default', 'Client logo required before white-label export.'],
        ].map(([title, value, description]) => (
          <Panel key={title}>
            <p className="text-xs font-bold uppercase text-slate-500">{title}</p>
            <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </Panel>
        ))}
      </div>
    </section>
  )
}

function ContactTable({
  contacts,
  onOpenAccount,
  onAction,
  onOpenReport,
  onOpenOutreach,
  onOpenDeck,
}: {
  contacts: Contact[]
  onOpenAccount: (contact: Contact) => void
  onAction: (contact: Contact, status: ContactStatus, action: string) => void
  onOpenReport: (contact: Contact) => void
  onOpenOutreach: (contact: Contact) => void
  onOpenDeck: (contact: Contact) => void
}) {
  return (
    <Panel>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>{['Contact', 'Company', 'Persona', 'Status', 'Last activity', 'Since sent', 'Suggested action', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3 font-bold">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <button onClick={() => onOpenAccount(contact)} className="font-bold text-slate-950 hover:text-brand">{contact.name}</button>
                  <p className="text-xs text-slate-500">{contact.email}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700">{contact.company}</td>
                <td className="px-4 py-3"><PersonaBadge persona={contact.persona} /></td>
                <td className="px-4 py-3"><StatusBadge status={contact.status} /></td>
                <td className="px-4 py-3 text-slate-600">{contact.lastActivity}</td>
                <td className="px-4 py-3 text-slate-600">{contact.sentAgo}</td>
                <td className="px-4 py-3 text-slate-600">{contact.action}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onOpenAccount(contact)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
                      360
                      <ChevronRight size={14} />
                    </button>
                    {completedStatus(contact.status) ? (
                      <>
                        <button onClick={() => onOpenReport(contact)} className="rounded-md bg-brand px-3 py-2 text-xs font-bold text-white">Report</button>
                        <button onClick={() => onOpenOutreach(contact)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Outreach</button>
                        <button onClick={() => onOpenDeck(contact)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">PPT</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => onAction(contact, contact.status, contact.status === 'Sent' ? 'Link resent' : 'Reminder sent')} className="rounded-md bg-brand px-3 py-2 text-xs font-bold text-white">
                          {contact.status === 'Sent' ? 'Resend' : 'Reminder'}
                        </button>
                        <button onClick={() => onAction(contact, 'Opened', 'Marked as opened')} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Mark opened</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm font-semibold text-slate-500">No matching contacts.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function AccountDrawer({ contact, onClose, onReport, onOutreach, onDeck }: { contact: Contact; onClose: () => void; onReport: () => void; onOutreach: () => void; onDeck: () => void }) {
  const completed = completedStatus(contact.status)

  return (
    <div className="fixed inset-0 z-30 bg-slate-950/30">
      <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-3xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-bold uppercase text-brand">Account 360</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{contact.company}</h2>
            <p className="text-sm text-slate-500">{contact.name} | {contact.designation}</p>
          </div>
          <button onClick={onClose} className="rounded-md border border-slate-200 p-2 text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-4">
            <Metric label="EWFM score" value={completed ? `${contact.score}%` : 'Pending'} />
            <Metric label="Maturity" value={completed ? scoreLevel(contact.score).split(' - ')[0] : 'Not ready'} />
            <Metric label="Status" value={contact.status} />
            <Metric label="Industry" value={contact.industry} />
          </div>
          <div className="mt-5">
            <h3 className="font-bold">Module breakdown</h3>
            <div className="mt-3 space-y-2">
              {Object.entries(contact.moduleScores).map(([module, score]) => {
                const risk = riskFor(score)
                return (
                  <div key={module} className="rounded-md border border-slate-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900">{module}</p>
                        <p className="text-xs text-slate-500">{scoreLevel(score)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${risk.className}`}>{risk.label} risk</span>
                        <span className="text-sm font-black">{score}%</span>
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-brand" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <Panel tight>
              <h3 className="font-bold">Engagement timeline</h3>
              {['Link Sent - Jun 10, 9:02 AM', 'Link Opened - Jun 11, 2:14 PM', 'Assessment Started - Jun 11, 2:16 PM', completed ? 'Assessment Completed - Jun 12, 10:45 AM' : 'Awaiting completion'].map((item) => (
                <div key={item} className="mt-3 flex gap-3 text-sm text-slate-600">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  {item}
                </div>
              ))}
            </Panel>
            <Panel tight>
              <h3 className="font-bold">AI sales intelligence</h3>
              <p className="mt-3 text-sm text-slate-600">{talkingPoint(contact)}</p>
              <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-bold uppercase text-blue-700">Next best action</p>
                <p className="mt-1 text-sm font-semibold text-blue-950">{contact.action}</p>
              </div>
            </Panel>
          </div>
        </div>
        <div className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-3">
          <ActionButton disabled={!completed} icon={FileText} label="Open Report" onClick={onReport} />
          <ActionButton disabled={!completed} icon={Mail} label="Create Outreach" onClick={onOutreach} />
          <ActionButton disabled={!completed} icon={Presentation} label="Build PPT" onClick={onDeck} />
        </div>
      </aside>
    </div>
  )
}

function talkingPoint(contact: Contact) {
  const [module, score] = weakestModules(contact)[0]
  if (contact.persona === 'CFO') return `${module} at ${score}% suggests preventable compliance, payroll, or audit-prep cost exposure that should be quantified in the first call.`
  if (contact.persona === 'CHRO') return `${module} at ${score}% is a workforce governance and experience gap; frame the conversation around modernization and risk reduction.`
  if (contact.persona === 'CDO') return `${module} at ${score}% indicates a visibility and AI-readiness gap across external workforce operations.`
  return `${module} at ${score}% shows a process automation gap that can be improved with integrated workflows and exception management.`
}

function prospectFromToken(token: string) {
  const normalized = token.toLowerCase()

  if (normalized.includes('chro')) return initialContacts[1]
  if (normalized.includes('cdo')) return initialContacts[2]
  if (normalized.includes('hr-digital') || normalized.includes('hrdigital')) return initialContacts[3]

  return initialContacts[0]
}

function personaPriority(persona: Persona) {
  if (persona === 'CFO') {
    return ['Compliance', 'Payroll', 'Analytics', 'Vendor', 'Attendance', 'PF', 'ESI', 'Cost', 'Approval']
  }

  if (persona === 'CHRO') {
    return ['Onboarding', 'Grievance', 'Exit', 'Training', 'Safety', 'Communication', 'Worker', 'Compliance', 'Approval']
  }

  if (persona === 'CDO') {
    return ['Analytics', 'AI', 'Forecasting', 'Digital', 'Repository', 'Integration', 'Dashboard', 'Communication', 'Automation']
  }

  return ['Automation', 'Workflow', 'Digital', 'Self-Service', 'Integration', 'Exception', 'Configurable', 'Approval', 'Repository']
}

function curateAssessmentQuestions(persona: Persona) {
  const priority = personaPriority(persona)

  return frameworkModules.flatMap((module) => {
    const moduleItems = frameworkItems.filter((item) => item.module === module)
    return [...moduleItems]
      .sort((a, b) => {
        const aText = `${a.practice} ${a.value}`
        const bText = `${b.practice} ${b.value}`
        const aRank = priority.findIndex((keyword) => aText.toLowerCase().includes(keyword.toLowerCase()))
        const bRank = priority.findIndex((keyword) => bText.toLowerCase().includes(keyword.toLowerCase()))
        return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank)
      })
      .slice(0, 3)
  })
}

function calculateAssessmentScores(questions: typeof frameworkItems, answers: Record<number, number>) {
  const moduleScores = Object.fromEntries(
    frameworkModules.map((module) => {
      const moduleQuestions = questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => question.module === module)
      const answeredValues = moduleQuestions
        .map(({ index }) => answers[index])
        .filter((value): value is number => typeof value === 'number')
      const average = answeredValues.length
        ? Math.round((answeredValues.reduce((sum, value) => sum + value, 0) / (answeredValues.length * 2)) * 100)
        : 0

      return [module, average]
    }),
  )
  const answered = Object.values(answers)
  const overall = answered.length ? Math.round((answered.reduce((sum, value) => sum + value, 0) / (answered.length * 2)) * 100) : 0

  return { overall, moduleScores }
}

function ReportDetail({ contact, onOutreach, onDeck, showAdminActions = true }: { contact: Contact; onOutreach: () => void; onDeck: () => void; showAdminActions?: boolean }) {
  const [reportView, setReportView] = useState<'report' | 'visual'>('report')
  const weak = weakestModules(contact)
  const moduleViewTitle = showAdminActions ? 'Admin extended view' : 'Module-wise view'
  const primaryGap = weak[0]?.[0] ?? 'your top maturity gap'
  const moduleEntries = Object.entries(contact.moduleScores)

  return (
    <div id="single-shot-report" className="mx-auto max-w-6xl rounded-md bg-white p-7 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-brand">Report view</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Switch between the written report and a visual summary of the same data.</p>
        </div>
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
          <button onClick={() => setReportView('report')} className={`rounded px-4 py-2 text-sm font-black ${reportView === 'report' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'}`}>Report</button>
          <button onClick={() => setReportView('visual')} className={`rounded px-4 py-2 text-sm font-black ${reportView === 'visual' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'}`}>Visualization</button>
        </div>
      </div>
      {reportView === 'visual' ? (
        <ReportVisualization contact={contact} weak={weak} moduleEntries={moduleEntries} />
      ) : (
        <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-brand">{contact.company}</p>
          <h2 className="mt-2 max-w-3xl text-[2rem] font-black leading-tight text-slate-950">External Workforce Management Maturity Assessment</h2>
          <p className="mt-4 text-base font-black text-slate-900">{contact.name}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">{contact.designation}</p>
          {showAdminActions && <p className="mt-2 text-sm text-slate-500">Industry: {contact.industry} | Assessment date: June 2026</p>}
        </div>
        <div className={`rounded-md p-5 ${scoreCardTone(contact.score)}`}>
          <p className="text-xs font-bold uppercase text-white/75">Overall score</p>
          <p className="mt-1 text-4xl font-black">{contact.score}%</p>
          <p className="text-sm text-white/90">{scoreLevel(contact.score)}</p>
        </div>
      </div>
      <section className="grid gap-5 py-5 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h3 className="text-lg font-black text-slate-950">Business outcome</h3>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600">Based on the score, BeeForce estimates that closing the top workforce gaps could reduce audit preparation effort by 40-60%, cut payroll exception cycles by 20-30%, and give leadership a cleaner view of contractor cost, compliance, and productivity.</p>
          <h3 className="mt-6 text-lg font-black text-slate-950">Key risks</h3>
          <div className="mt-3 space-y-3">
            {weak.map(([module, score]) => (
              <div key={module} className="rounded-md border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-black text-slate-950">{module}</p>
                  <span className="font-black text-red-700">{score}%</span>
                </div>
                <p className="mt-2 text-sm font-medium leading-5 text-slate-600">Missing practices: {frameworkItems.filter((item) => item.module === module).slice(0, 3).map((item) => item.practice).join(', ')}.</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-950">Potential business impact</h3>
          <div className="mt-3 divide-y divide-slate-100 rounded-md border border-slate-200">
            {weak.map(([module]) => (
              <div key={module} className="flex items-center justify-between gap-4 p-3 text-sm">
                <span className="font-bold text-slate-700">{module}</span>
                <span className="text-right font-black text-slate-950">30-50% effort reduction</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-slate-200 pt-5">
        <h3 className="text-lg font-black text-slate-950">{moduleViewTitle}</h3>
        {!showAdminActions && <p className="mt-2 text-sm font-medium text-slate-600">Average score by module, calculated from the responses submitted in this assessment.</p>}
        <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
          {moduleEntries.map(([module, score]) => (
            <div key={module} className="grid grid-cols-[1fr_90px_110px] gap-3 border-b border-slate-100 p-3 text-sm last:border-0">
              <span className="font-bold text-slate-900">{module}</span>
              <span className="font-black text-slate-800">{score}%</span>
              <span className={`rounded-full px-2 py-1 text-center text-xs font-bold ring-1 ${riskFor(score).className}`}>{riskFor(score).label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-slate-200 pt-5">
        <div className="rounded-md bg-blue-50 p-5">
          <p className="text-xs font-bold uppercase text-blue-700">Recommended next step</p>
          <h3 className="mt-2 text-lg font-black text-blue-950">Discuss your top maturity gaps with BeeForce</h3>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-blue-950">Book a consulting call to review {primaryGap}, validate your top maturity gaps, and identify the fastest path to improve external workforce control.</p>
          {!showAdminActions && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-white">Book a consulting call</button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-950"><Download size={16} /> Download report</button>
            </div>
          )}
          {showAdminActions && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={onOutreach} className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-white"><Mail size={16} /> Create Outreach</button>
              <button onClick={onDeck} className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-950"><Presentation size={16} /> Build PPT</button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-950"><Download size={16} /> Download PDF</button>
            </div>
          )}
        </div>
      </section>
        </>
      )}
    </div>
  )
}

function ReportVisualization({
  contact,
  weak,
  moduleEntries,
}: {
  contact: Contact
  weak: Array<[string, number]>
  moduleEntries: Array<[string, number]>
}) {
  const [hoveredModule, setHoveredModule] = useState<{ module: string; score: number; x: number; y: number } | null>(null)
  const riskCounts = moduleEntries.reduce(
    (acc, [, score]) => {
      if (score < 45) acc.high += 1
      else if (score < 70) acc.medium += 1
      else acc.low += 1
      return acc
    },
    { high: 0, medium: 0, low: 0 },
  )
  const total = Math.max(moduleEntries.length, 1)
  const highDeg = (riskCounts.high / total) * 360
  const mediumDeg = ((riskCounts.high + riskCounts.medium) / total) * 360
  const strongest = [...moduleEntries].sort((a, b) => b[1] - a[1]).slice(0, 3)
  const cx = 180
  const cy = 180
  const ringRadius = 128
  const modulePoints = moduleEntries.map(([module, score], index) => {
    const angle = -90 + (index * 360) / moduleEntries.length
    const radians = (angle * Math.PI) / 180
    const length = 46 + score * 0.9
    return {
      module,
      score,
      angle,
      radians,
      x1: cx + Math.cos(radians) * 38,
      y1: cy + Math.sin(radians) * 38,
      x2: cx + Math.cos(radians) * length,
      y2: cy + Math.sin(radians) * length,
      lx: cx + Math.cos(radians) * (ringRadius + 42),
      ly: cy + Math.sin(radians) * (ringRadius + 42),
    }
  })

  return (
    <div className="space-y-5 bg-[#fbfaf6] p-5">
      <div className="space-y-5">
        <div className="rounded-md border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-brand">Maturity constellation</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">{contact.company}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">Each spoke represents a module. Longer spokes mean stronger maturity.</p>
            </div>
            <div className={`rounded-md px-4 py-3 ${scoreCardTone(contact.score)}`}>
              <p className="text-xs font-bold uppercase text-white/75">Overall</p>
              <p className="text-3xl font-black">{contact.score}%</p>
            </div>
          </div>
          <div className="relative">
            <svg viewBox="0 0 360 360" className="mx-auto mt-4 h-[560px] max-h-[68vh] min-h-[500px] w-full max-w-[720px]" role="img" aria-label="Module maturity radial visualization">
            {[46, 76, 106, 136].map((radius, index) => (
              <g key={radius}>
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" />
                <text x={cx + radius + 3} y={cy - 3} className="fill-slate-300 text-[6px] font-bold">{(index + 1) * 25}</text>
              </g>
            ))}
            <circle cx={cx} cy={cy} r="31" fill="#0f172a" />
            <text x={cx} y={cy - 2} textAnchor="middle" className="fill-white text-[18px] font-black">{contact.score}%</text>
            <text x={cx} y={cy + 15} textAnchor="middle" className="fill-white/80 text-[7px] font-bold">overall</text>
            {modulePoints.map((point) => {
              const isActive = hoveredModule?.module === point.module
              return (
              <g
                key={point.module}
                onMouseEnter={() => setHoveredModule({ module: point.module, score: point.score, x: point.x2, y: point.y2 })}
                onMouseLeave={() => setHoveredModule(null)}
                className="cursor-pointer"
              >
                <line x1={point.x1} y1={point.y1} x2={point.x2} y2={point.y2} stroke="#cbd5e1" strokeWidth="1" />
                <line x1={point.x1} y1={point.y1} x2={point.x2} y2={point.y2} stroke={point.score < 45 ? '#ef4444' : point.score < 70 ? '#f59e0b' : '#10b981'} strokeWidth={isActive ? '12' : '8'} strokeLinecap="round" opacity={isActive ? '1' : '.82'} />
                <circle cx={point.x2} cy={point.y2} r={isActive ? '7' : '5'} fill={point.score < 45 ? '#ef4444' : point.score < 70 ? '#f59e0b' : '#10b981'} />
                <text
                  x={point.lx}
                  y={point.ly}
                  textAnchor={point.lx < cx - 8 ? 'end' : point.lx > cx + 8 ? 'start' : 'middle'}
                  className="fill-slate-700 text-[7px] font-bold"
                >
                  {point.module.replace('Workforce ', '').replace(' Management', '')}
                </text>
                <text
                  x={point.lx}
                  y={point.ly + 10}
                  textAnchor={point.lx < cx - 8 ? 'end' : point.lx > cx + 8 ? 'start' : 'middle'}
                  className={`text-[8px] font-black ${point.score < 45 ? 'fill-red-700' : point.score < 70 ? 'fill-amber-700' : 'fill-emerald-700'}`}
                >
                  {point.score}%
                </text>
              </g>
            )})}
            </svg>
            {hoveredModule && (
              <div
                className="pointer-events-none absolute w-56 rounded-md border border-slate-200 bg-white/95 p-3 text-center shadow-xl"
                style={{
                  left: `calc(50% + ${(hoveredModule.x - cx) * 1.55}px)`,
                  top: `calc(50% + ${(hoveredModule.y - cy) * 1.55}px)`,
                  transform: 'translate(-50%, -115%)',
                }}
              >
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Module detail</p>
                <p className="mt-1 text-sm font-black text-slate-950">{hoveredModule.module}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className={`text-lg font-black ${scoreTextTone(hoveredModule.score)}`}>{hoveredModule.score}%</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${riskFor(hoveredModule.score).className}`}>{riskFor(hoveredModule.score).label} risk</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-500">{scoreLevel(hoveredModule.score)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Risk distribution</p>
            <div className="mt-4 flex items-center gap-5">
              <div
                className="h-36 w-36 rounded-full"
                style={{ background: `conic-gradient(#ef4444 0deg ${highDeg}deg, #f59e0b ${highDeg}deg ${mediumDeg}deg, #10b981 ${mediumDeg}deg 360deg)` }}
              />
              <div className="space-y-3 text-sm font-bold text-slate-700">
                <p><span className="mr-2 inline-block h-2 w-6 rounded-full bg-red-500" />High: {riskCounts.high}</p>
                <p><span className="mr-2 inline-block h-2 w-6 rounded-full bg-amber-500" />Medium: {riskCounts.medium}</p>
                <p><span className="mr-2 inline-block h-2 w-6 rounded-full bg-emerald-500" />Low: {riskCounts.low}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wide text-red-700">Top maturity gaps</p>
            <div className="mt-4 space-y-3">
              {weak.map(([module, score], index) => (
                <div key={module} className="grid grid-cols-[28px_1fr_56px] items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-xs font-black text-red-700">{index + 1}</span>
                  <p className="text-sm font-black text-slate-950">{module}</p>
                  <p className="text-right font-black text-red-700">{score}%</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Strongest modules</p>
            <div className="mt-4 space-y-3">
              {strongest.map(([module, score]) => (
                <div key={module} className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-950">{module}</p>
                  <p className="font-black text-emerald-700">{score}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-black text-slate-950">Module maturity ledger</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {moduleEntries.map(([module, score]) => (
            <div key={module} className="grid grid-cols-[1fr_90px] items-center gap-3 rounded-md bg-slate-50 p-3">
              <div>
                <p className="text-sm font-black text-slate-950">{module}</p>
                <div className="mt-2 h-2 rounded-full bg-white">
                  <div className={`h-2 rounded-full ${scoreFillTone(score)}`} style={{ width: `${score}%` }} />
                </div>
              </div>
              <p className={`text-right text-xl font-black ${scoreTextTone(score)}`}>{score}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OutreachBuilder({ contact }: { contact: Contact }) {
  const [activeStep, setActiveStep] = useState(0)
  const [activeAsset, setActiveAsset] = useState('Demo Script')
  const [notice, setNotice] = useState('')
  const weak = weakestModules(contact)[0]
  const steps = [
    { day: 'Day 0', channel: 'Email', purpose: `Your ${contact.company} Workforce Maturity Score is Ready` },
    { day: 'Day 2', channel: 'LinkedIn', purpose: 'Connection note with industry benchmark' },
    { day: 'Day 4', channel: 'Email', purpose: `The hidden cost of ${weak[0]} gaps at ${contact.company}` },
    { day: 'Day 7', channel: 'WhatsApp', purpose: 'Short report nudge' },
    { day: 'Day 9', channel: 'LinkedIn', purpose: 'Peer benchmark follow-up' },
    { day: 'Day 14', channel: 'Email', purpose: 'Final soft CTA' },
  ]
  const selectedStep = steps[activeStep]
  const assetCopy: Record<string, string> = {
    'Demo Script': `Open with the ${contact.score}% score, then demo ${weak[0]} first because it is the lowest module at ${weak[1]}%. Ask how ${contact.company} currently detects exceptions before payroll and compliance closure.`,
    'Objection Handling': `"We already have a system" -> "That is clear from your stronger modules. This discussion is about the specific ${weak[0]} gap at ${weak[1]}%, not replacing what works."`,
    'Guided Questions': `1. What triggers a manual exception today?\n2. Who owns ${weak[0]} follow-up?\n3. What would need to improve for this to become a priority this quarter?`,
    'WhatsApp Copy': `Hi ${contact.name.split(' ')[0]}, your EWFM report is ready. Your overall score is ${contact.score}%, with ${weak[0]} as the biggest opportunity. Worth a quick walkthrough this week?`,
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr_.8fr]">
      <Panel>
        <h2 className="font-black">6-step sequence</h2>
        <div className="mt-4 space-y-2">
          {steps.map((step, index) => (
            <button key={step.day} onClick={() => setActiveStep(index)} className={`w-full rounded-md border p-3 text-left ${index === activeStep ? 'border-brand bg-blue-50' : 'border-slate-200 bg-white'}`}>
              <p className="text-xs font-bold uppercase text-slate-500">{step.day} | {step.channel}</p>
              <p className="mt-1 font-semibold text-slate-900">{step.purpose}</p>
            </button>
          ))}
        </div>
      </Panel>
      <Panel>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-brand">{selectedStep.channel} | {selectedStep.day}</p>
            <h2 className="font-black">{selectedStep.purpose}</h2>
          </div>
          <button onClick={() => setNotice(`${selectedStep.channel} copy copied`)} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><Copy size={14} /> Copy</button>
        </div>
        {notice && <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{notice}</p>}
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <p className="font-bold">Subject: {selectedStep.purpose}</p>
          <p className="mt-4">Hi {contact.name.split(' ')[0]},</p>
          <p className="mt-3">Your EWFM maturity data shows an overall score of {contact.score}%. For this touch, the message focuses on {selectedStep.channel === 'WhatsApp' ? 'a short, low-friction nudge' : weak[0]}.</p>
          <p className="mt-3">{talkingPoint(contact)}</p>
          <p className="mt-3">Would a 30-minute walkthrough this week be useful? I can show the top gaps and the specific BeeForce capabilities that address them.</p>
          <p className="mt-3">Warm regards,<br />Ananya Rao<br />BeeForce | External Workforce Management</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setNotice(`${selectedStep.channel} step approved`)} className="rounded-md bg-brand px-3 py-2 text-sm font-bold text-white">Approve step</button>
          <button onClick={() => setNotice(`${selectedStep.channel} step queued for edit`)} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">Edit draft</button>
        </div>
      </Panel>
      <Panel>
        <h2 className="font-black">Asset library</h2>
        {['Demo Script', 'Objection Handling', 'Guided Questions', 'WhatsApp Copy'].map((asset) => (
          <button key={asset} onClick={() => setActiveAsset(asset)} className={`mt-3 w-full rounded-md border p-3 text-left ${activeAsset === asset ? 'border-brand bg-blue-50' : 'border-slate-200'}`}>
            <p className="font-bold">{asset}</p>
            <p className="mt-1 text-sm text-slate-500">Generated from score, persona, industry, and weakest modules.</p>
          </button>
        ))}
        <div className="mt-4 whitespace-pre-line rounded-md bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-700">{assetCopy[activeAsset]}</div>
      </Panel>
    </div>
  )
}

function DeckBuilder({ contact }: { contact: Contact }) {
  const [template, setTemplate] = useState('Executive Brief')
  const [activeSlide, setActiveSlide] = useState(0)
  const [notice, setNotice] = useState('')
  const slides = ['Cover', 'About Assessment', 'Score at a Glance', 'Industry Benchmark', 'Top 3 Risk Areas', 'Business Impact', '30/60/90 Roadmap', 'BeeForce Fit', 'Suggested Next Step', 'Appendix']
  const weak = weakestModules(contact)

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <Panel>
        <h2 className="font-black">Deck templates</h2>
        {['Executive Brief', 'Detailed Consulting Deck', 'BDR Call Prep'].map((option, index) => (
          <button key={option} onClick={() => { setTemplate(option); setActiveSlide(0); setNotice(`${option} selected`) }} className={`mt-3 w-full rounded-md border p-3 text-left ${template === option ? 'border-brand bg-blue-50' : 'border-slate-200'}`}>
            <p className="font-bold">{option}</p>
            <p className="text-sm text-slate-500">{index === 0 ? '10-slide buyer-ready deck' : 'Generated from report data'}</p>
          </button>
        ))}
        <button onClick={() => setNotice(`${template} exported for ${contact.company}`)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold text-white"><Download size={16} /> Export PPT</button>
        {notice && <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{notice}</p>}
      </Panel>
      <Panel>
        <div className="aspect-[16/9] rounded-md border border-slate-200 bg-slate-950 p-8 text-white">
          <img src={beeforceLogo} alt="BeeForce" className="h-10 brightness-0 invert" />
          <p className="mt-16 text-sm font-bold uppercase text-blue-200">{template} | Slide {activeSlide + 1}</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black">{slides[activeSlide]}</h2>
          <p className="mt-5 text-lg text-slate-300">{contact.company} | Score {contact.score}% | {scoreLevel(contact.score)}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">Related data: {weak.map(([module, score]) => `${module} ${score}%`).join(' | ')}</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {slides.map((slide, index) => (
            <button key={slide} onClick={() => setActiveSlide(index)} className={`rounded-md border bg-white p-3 text-left ${activeSlide === index ? 'border-brand ring-2 ring-blue-100' : 'border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-400">Slide {index + 1}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{slide}</p>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function AssessmentExperience() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const pathParts = window.location.pathname.split('/').filter(Boolean)
  const token = pathParts[pathParts.length - 1] ?? 'demo-cfo-token'
  const prospect = prospectFromToken(token)
  const questions = useMemo(() => curateAssessmentQuestions(prospect.persona), [prospect.persona])
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)
  const resultScores = useMemo(() => calculateAssessmentScores(questions, answers), [answers, questions])

  if (submitted) {
    return <PersonaReport contact={{ ...prospect, score: resultScores.overall, moduleScores: resultScores.moduleScores }} />
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <img src={beeforceLogo} alt="BeeForce" className="h-9 object-contain" />
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-brand">{prospect.persona} assessment</p>
            <p className="text-sm font-semibold text-slate-600">{progress}% complete</p>
          </div>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-brand" style={{ width: `${progress}%` }} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="rounded-md bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-brand">{prospect.company}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">External Workforce Management Maturity Assessment</h1>
          <p className="mt-3 max-w-3xl text-slate-600">This assessment benchmarks {prospect.company} against the BeeForce External Workforce Management maturity framework. It takes about 5-7 minutes and covers the 10 areas that shape external workforce cost, compliance, control, and operating visibility.</p>
          <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-950">For each framework item, select the option that best reflects your current capability.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric label="Framework" value="BeeForce EWFM" />
            <Metric label="Length" value={`${questions.length} focused checks`} />
            <Metric label="Response options" value="3 choices" />
          </div>
        </section>
        <div className="mt-5 space-y-5">
          {frameworkModules.map((module) => (
            <section key={module} className="rounded-md bg-white shadow-sm">
              <div className="sticky top-[73px] z-10 border-b border-slate-100 bg-white px-5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-black text-slate-950">{module}</h2>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">Framework section</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {questions.filter((question) => question.module === module).map((question) => {
                  const index = questions.indexOf(question)
                  return (
                    <div key={`${question.module}-${question.practice}`} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,330px)] lg:items-center">
                      <div>
                        <p className="font-black text-slate-950">{question.practice}</p>
                        <p className="mt-2 text-sm font-medium text-slate-600">{question.value}.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {answerOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setAnswers((current) => ({ ...current, [index]: option.value }))}
                            className={`min-h-[56px] rounded-md border bg-white px-3 py-2 text-center text-sm font-black leading-tight ${answers[index] === option.value ? option.activeClass : option.idleClass}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
        <div className="sticky bottom-0 mt-6 rounded-md border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-600">{Object.keys(answers).length} of {questions.length} answered. Partial submission requires at least 70%.</p>
            <button disabled={progress < 70} onClick={() => setSubmitted(true)} className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Submit Assessment</button>
          </div>
        </div>
      </main>
    </div>
  )
}

function PersonaReport({ contact }: { contact: Contact }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <img src={beeforceLogo} alt="BeeForce" className="h-9 object-contain" />
          <button className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-white">Book a Demo</button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <ReportDetail contact={contact} onOutreach={() => undefined} onDeck={() => undefined} showAdminActions={false} />
      </main>
    </div>
  )
}

function FullscreenOverlay({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 bg-[#f4f7fb]">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
        <h2 className="text-lg font-black">{title}</h2>
        <button onClick={onClose} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">
          <X size={16} />
          Back
        </button>
      </header>
      <main className="h-[calc(100vh-4rem)] overflow-y-auto p-5">{children}</main>
    </div>
  )
}

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-brand">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-black text-slate-950">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function Panel({ children, tight = false }: { children: React.ReactNode; tight?: boolean }) {
  return <div className={`rounded-md border border-slate-200 bg-white shadow-sm ${tight ? 'p-4' : 'p-5'}`}>{children}</div>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
      <input value={value} readOnly className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800" />
    </label>
  )
}

function Segment({ label, options, active }: { label: string; options: string[]; active: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button key={option} className={`rounded-md border px-3 py-2 text-sm font-bold ${option === active ? 'border-brand bg-blue-50 text-brand' : 'border-slate-200 text-slate-600'}`}>{option}</button>
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  )
}

function ActionButton({ disabled, icon: Icon, label, onClick }: { disabled: boolean; icon: typeof FileText; label: string; onClick: () => void }) {
  return (
    <button disabled={disabled} onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
      <Icon size={17} />
      {label}
    </button>
  )
}

function PersonaBadge({ persona }: { persona: Persona }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{persona}</span>
}

function StatusBadge({ status }: { status: ContactStatus }) {
  const tone = status === 'Completed' || status === 'Report Viewed' || status === 'Outreach Sent' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : status === 'In Progress' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-blue-50 text-blue-700 ring-blue-200'
  return <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${tone}`}>{status}</span>
}

function ValidationBadge({ status }: { status: string }) {
  const tone = status === 'Valid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : status === 'Duplicate' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-red-50 text-red-700 ring-red-200'
  const Icon = status === 'Valid' ? Check : status === 'Duplicate' ? Copy : X
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ring-1 ${tone}`}><Icon size={12} />{status}</span>
}

export default App
