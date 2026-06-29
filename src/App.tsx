import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FilePlus2,
  FileText,
  Search,
  Send,
  Users,
  WalletCards,
} from 'lucide-react'
import './App.css'

type InvoiceStatus = 'Draft' | 'Sent' | 'Overdue' | 'Paid'

type Invoice = {
  id: string
  client: string
  owner: string
  amount: number
  due: string
  status: InvoiceStatus
  project: string
  lastTouch: string
  lineItems: string[]
}

const invoices: Invoice[] = [
  {
    id: 'BF-1048',
    client: 'Northstar Clinics',
    owner: 'Maya',
    amount: 12840,
    due: 'Jul 02',
    status: 'Sent',
    project: 'Patient intake rebuild',
    lastTouch: 'Reminder queued for finance lead',
    lineItems: ['Discovery sprint', 'UI implementation', 'QA support'],
  },
  {
    id: 'BF-1049',
    client: 'Harbor Grid',
    owner: 'Jon',
    amount: 7420,
    due: 'Jul 08',
    status: 'Draft',
    project: 'Usage dashboard',
    lastTouch: 'Waiting on usage export',
    lineItems: ['Analytics model', 'Dashboard polish', 'Admin notes'],
  },
  {
    id: 'BF-1050',
    client: 'Cedar Labs',
    owner: 'Maya',
    amount: 19400,
    due: 'Jun 24',
    status: 'Overdue',
    project: 'Compliance portal',
    lastTouch: 'Escalated to account owner',
    lineItems: ['Portal shell', 'Role matrix', 'Export workflow'],
  },
  {
    id: 'BF-1051',
    client: 'Aster Freight',
    owner: 'Rafi',
    amount: 5600,
    due: 'Jun 29',
    status: 'Paid',
    project: 'Driver app audit',
    lastTouch: 'Receipt sent automatically',
    lineItems: ['Route review', 'Bug sweep', 'Handoff call'],
  },
]

const filters = ['All', 'Draft', 'Sent', 'Overdue', 'Paid'] as const
type Filter = (typeof filters)[number]

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

const theme = {
  '--accent': '#246bfe',
  '--accent-2': '#18a37a',
  '--accent-3': '#f3a21b',
} as CSSProperties

function getStatusClass(status: InvoiceStatus) {
  if (status === 'Paid') return 'good'
  if (status === 'Overdue') return 'bad'
  if (status === 'Sent') return 'info'
  return 'warn'
}

function App() {
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(invoices[0].id)
  const selected = invoices.find((invoice) => invoice.id === selectedId) ?? invoices[0]

  const visibleInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()
    return invoices.filter((invoice) => {
      const matchesFilter = filter === 'All' || invoice.status === filter
      const matchesSearch =
        !query ||
        [invoice.id, invoice.client, invoice.project, invoice.owner]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  const totals = useMemo(() => {
    const open = invoices
      .filter((invoice) => invoice.status !== 'Paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0)
    const overdue = invoices
      .filter((invoice) => invoice.status === 'Overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0)
    const paid = invoices
      .filter((invoice) => invoice.status === 'Paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0)

    return { open, overdue, paid, count: invoices.length }
  }, [])

  return (
    <main className="app" style={theme}>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <FileText size={22} aria-hidden="true" />
            </span>
            <div>
              <h1>BillFrame</h1>
              <p>Billing workspace for client teams</p>
            </div>
          </div>
          <div className="toolbar">
            <button className="icon-button" type="button" aria-label="Open notifications">
              <Bell size={18} aria-hidden="true" />
            </button>
            <button className="ghost-button" type="button">
              <Download size={17} aria-hidden="true" />
              Export
            </button>
            <button className="action-button" type="button">
              <FilePlus2 size={17} aria-hidden="true" />
              New invoice
            </button>
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Revenue control room</p>
            <h2>Invoices, approvals, reminders, and payment state in one place.</h2>
            <p>
              BillFrame tracks every invoice from draft to paid with client context,
              reminder timing, audit notes, and a clean review path for finance teams.
            </p>
          </div>
          <aside className="command-stack" aria-label="Invoice actions">
            <button className="action-button" type="button">
              <Send size={17} aria-hidden="true" />
              Send selected invoice
            </button>
            <button className="ghost-button" type="button">
              <Clock3 size={17} aria-hidden="true" />
              Schedule reminder
            </button>
            <button className="ghost-button" type="button">
              <CreditCard size={17} aria-hidden="true" />
              Copy payment link
            </button>
          </aside>
        </section>

        <section className="stats-grid" aria-label="Billing summary">
          <article className="metric">
            <span className="metric-icon">
              <WalletCards size={19} aria-hidden="true" />
            </span>
            <h3>{currency.format(totals.open)}</h3>
            <p>Open receivables</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <CheckCircle2 size={19} aria-hidden="true" />
            </span>
            <h3>{currency.format(totals.paid)}</h3>
            <p>Paid this cycle</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <Clock3 size={19} aria-hidden="true" />
            </span>
            <h3>{currency.format(totals.overdue)}</h3>
            <p>Overdue balance</p>
          </article>
          <article className="metric">
            <span className="metric-icon">
              <Users size={19} aria-hidden="true" />
            </span>
            <h3>{totals.count}</h3>
            <p>Client invoices</p>
          </article>
        </section>

        <section className="workspace-grid">
          <div className="panel">
            <div className="panel-title">
              <div>
                <h2>Invoice pipeline</h2>
                <p>Filter, search, and inspect the full billing queue.</p>
              </div>
            </div>
            <div className="search-row">
              <label className="search-box">
                <Search size={17} aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search invoices"
                />
              </label>
            </div>
            <div className="filter-row" aria-label="Invoice filters">
              {filters.map((item) => (
                <button
                  className={`filter-pill ${filter === item ? 'active' : ''}`}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Owner</th>
                    <th>Due</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <button
                          className="row-button"
                          type="button"
                          onClick={() => setSelectedId(invoice.id)}
                        >
                          <span className="strong">{invoice.id}</span>
                          <br />
                          <span className="muted">{invoice.project}</span>
                        </button>
                      </td>
                      <td>{invoice.client}</td>
                      <td>{invoice.owner}</td>
                      <td>{invoice.due}</td>
                      <td>{currency.format(invoice.amount)}</td>
                      <td>
                        <span className={`status ${getStatusClass(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="panel">
            <div className="panel-title">
              <div>
                <h2>{selected.client}</h2>
                <p>{selected.id} payment packet</p>
              </div>
              <span className={`status ${getStatusClass(selected.status)}`}>
                {selected.status}
              </span>
            </div>
            <div className="detail-stack">
              <div className="mini-grid">
                <div className="mini-stat">
                  <p>Amount</p>
                  <strong>{currency.format(selected.amount)}</strong>
                </div>
                <div className="mini-stat">
                  <p>Due</p>
                  <strong>{selected.due}</strong>
                </div>
              </div>
              <div className="detail-row">
                <span className="muted">Project</span>
                <span className="strong">{selected.project}</span>
              </div>
              <div className="detail-row">
                <span className="muted">Last touch</span>
                <span>{selected.lastTouch}</span>
              </div>
              <div className="detail-row">
                <span className="muted">Line items</span>
                {selected.lineItems.map((item) => (
                  <span className="split-row" key={item}>
                    <span>{item}</span>
                    <CheckCircle2 size={16} aria-hidden="true" />
                  </span>
                ))}
              </div>
              <div className="detail-row">
                <span className="muted">Payment readiness</span>
                <div className="progress" aria-label="Payment readiness 76 percent">
                  <span style={{ width: '76%' }} />
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
