import { useMemo, useState } from 'react'
import {
  BellOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  DownloadOutlined,
  FileAddOutlined,
  FileTextOutlined,
  SendOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Input,
  Layout,
  List,
  Progress,
  Row,
  Segmented,
  Space,
  Statistic,
  Steps,
  Table,
  Tag,
  theme,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
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

function getTagColor(status: InvoiceStatus) {
  if (status === 'Paid') return 'green'
  if (status === 'Overdue') return 'red'
  if (status === 'Sent') return 'blue'
  return 'gold'
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

  const columns: TableColumnsType<Invoice> = [
    {
      title: 'Invoice',
      dataIndex: 'id',
      render: (_, invoice) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{invoice.id}</Typography.Text>
          <Typography.Text type="secondary">{invoice.project}</Typography.Text>
        </Space>
      ),
    },
    { title: 'Client', dataIndex: 'client' },
    { title: 'Owner', dataIndex: 'owner' },
    { title: 'Due', dataIndex: 'due' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (value: number) => currency.format(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: InvoiceStatus) => <Tag color={getTagColor(value)}>{value}</Tag>,
    },
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 10,
          colorPrimary: '#1677ff',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <Layout className="billframe-app">
        <Layout.Header className="bf-header">
          <Flex align="center" justify="space-between" gap={16} wrap>
            <Space size={12}>
              <Badge count={3} offset={[-2, 4]}>
                <div className="bf-logo">
                  <FileTextOutlined />
                </div>
              </Badge>
              <div>
                <Typography.Title level={3}>BillFrame</Typography.Title>
                <Typography.Text type="secondary">Billing workspace for client teams</Typography.Text>
              </div>
            </Space>
            <Space wrap>
              <Button icon={<BellOutlined />}>Alerts</Button>
              <Button icon={<DownloadOutlined />}>Export</Button>
              <Button type="primary" icon={<FileAddOutlined />}>
                New invoice
              </Button>
            </Space>
          </Flex>
        </Layout.Header>

        <Layout.Content className="bf-content">
          <Row gutter={[18, 18]}>
            <Col xs={24} lg={16}>
              <Card className="bf-hero">
                <Typography.Text type="secondary">Revenue control room</Typography.Text>
                <Typography.Title level={1}>
                  Invoices, reminders, approvals, and payment state.
                </Typography.Title>
                <Typography.Paragraph>
                  Ant Design drives the interface: enterprise table behavior, native stats,
                  tags, progress, steps, and card spacing.
                </Typography.Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Payment packet" className="bf-command-card">
                <Space direction="vertical" size="middle">
                  <Button block type="primary" icon={<SendOutlined />}>
                    Send selected invoice
                  </Button>
                  <Button block icon={<ClockCircleOutlined />}>
                    Schedule reminder
                  </Button>
                  <Button block icon={<CreditCardOutlined />}>
                    Copy payment link
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row gutter={[18, 18]} className="bf-stats">
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic
                  title="Open receivables"
                  value={totals.open}
                  prefix={<WalletOutlined />}
                  formatter={(value) => currency.format(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic
                  title="Paid this cycle"
                  value={totals.paid}
                  prefix={<CreditCardOutlined />}
                  formatter={(value) => currency.format(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic
                  title="Overdue balance"
                  value={totals.overdue}
                  prefix={<ClockCircleOutlined />}
                  formatter={(value) => currency.format(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic title="Client invoices" value={totals.count} prefix={<TeamOutlined />} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[18, 18]}>
            <Col xs={24} xl={16}>
              <Card
                title="Invoice pipeline"
                extra={
                  <Segmented
                    value={filter}
                    options={[...filters]}
                    onChange={(value) => setFilter(value as Filter)}
                  />
                }
              >
                <Input.Search
                  allowClear
                  placeholder="Search invoices"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="bf-search"
                />
                <Table
                  columns={columns}
                  dataSource={visibleInvoices}
                  pagination={false}
                  rowKey="id"
                  scroll={{ x: 760 }}
                  onRow={(invoice) => ({
                    onClick: () => setSelectedId(invoice.id),
                  })}
                />
              </Card>
            </Col>
            <Col xs={24} xl={8}>
              <Card
                title={selected.client}
                extra={<Tag color={getTagColor(selected.status)}>{selected.status}</Tag>}
              >
                <Space direction="vertical" size="large" className="bf-detail">
                  <Statistic
                    title={`${selected.id} amount`}
                    value={selected.amount}
                    formatter={(value) => currency.format(Number(value))}
                  />
                  <Progress percent={76} status="active" />
                  <Steps
                    direction="vertical"
                    size="small"
                    current={selected.status === 'Paid' ? 3 : selected.status === 'Sent' ? 2 : 1}
                    items={[
                      { title: 'Drafted', description: selected.project },
                      { title: 'Reviewed', description: selected.owner },
                      { title: 'Sent', description: selected.lastTouch },
                      { title: 'Paid', description: selected.due },
                    ]}
                  />
                  <List
                    header="Line items"
                    dataSource={selected.lineItems}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
