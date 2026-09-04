import { db } from '../lib/db/client';
import {
  users,
  portalClients,
  portalUsers,
  portalEngagements,
  portalTasks,
  portalComplianceItems,
  portalDocuments,
  portalInvoices,
  portalPayments,
  portalMeetings,
  portalReports,
  portalSupportTickets,
  portalTicketReplies,
} from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seedPortalDemo() {
  console.log('🌱 Seeding Client Portal demo data & credentials...');

  // ─── 1. SEED PORTAL ADMIN USER (admin@gmail.com / admin123) ──────────────
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  let [adminUser] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  if (!adminUser) {
    console.log(`Creating Admin User: ${adminEmail}...`);
    [adminUser] = await db
      .insert(users)
      .values({
        name: 'Portal Administrator',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
      })
      .returning();
  } else {
    console.log(`Updating password for existing Admin User: ${adminEmail}...`);
    await db
      .update(users)
      .set({ password: hashedAdminPassword, role: 'admin' })
      .where(eq(users.id, adminUser.id));
  }

  // Ensure Admin in portalUsers as PORTAL_ADMIN
  const [existingPortalAdmin] = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.userId, adminUser.id))
    .limit(1);

  if (!existingPortalAdmin) {
    await db.insert(portalUsers).values({
      userId: adminUser.id,
      clientId: null,
      portalRole: 'PORTAL_ADMIN',
    });
  } else {
    await db
      .update(portalUsers)
      .set({ portalRole: 'PORTAL_ADMIN' })
      .where(eq(portalUsers.id, existingPortalAdmin.id));
  }
  console.log(`✅ Portal Admin Ready: ${adminEmail} / ${adminPassword}`);

  // ─── 2. SEED CLIENT USER & PROFILE (client@gmail.com / client123) ─────────
  const clientEmail = 'client@gmail.com';
  const clientPassword = 'client123';
  const hashedClientPassword = await bcrypt.hash(clientPassword, 10);

  let [clientProfile] = await db
    .select()
    .from(portalClients)
    .where(eq(portalClients.email, clientEmail))
    .limit(1);

  if (!clientProfile) {
    console.log(`Creating Client Organization Profile for ${clientEmail}...`);
    [clientProfile] = await db
      .insert(portalClients)
      .values({
        companyName: 'Acme Corporation',
        contactName: 'Sarah Jenkins',
        email: clientEmail,
        phone: '+1 (555) 234-5678',
        address: '100 Financial Center Blvd, New York, NY 10005',
        status: 'ACTIVE',
        createdBy: adminUser.id,
      })
      .returning();
  }

  let [clientUser] = await db.select().from(users).where(eq(users.email, clientEmail)).limit(1);

  if (!clientUser) {
    console.log(`Creating Client User User: ${clientEmail}...`);
    [clientUser] = await db
      .insert(users)
      .values({
        name: 'Sarah Jenkins (Acme Corporation)',
        email: clientEmail,
        password: hashedClientPassword,
        role: 'client',
      })
      .returning();
  } else {
    console.log(`Updating password for existing Client User: ${clientEmail}...`);
    await db
      .update(users)
      .set({ password: hashedClientPassword, role: 'client' })
      .where(eq(users.id, clientUser.id));
  }

  // Link Client User & Client Profile in portalUsers
  const [existingPortalUser] = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.userId, clientUser.id))
    .limit(1);

  if (!existingPortalUser) {
    await db.insert(portalUsers).values({
      userId: clientUser.id,
      clientId: clientProfile.id,
      portalRole: 'CLIENT',
    });
  } else {
    await db
      .update(portalUsers)
      .set({ clientId: clientProfile.id, portalRole: 'CLIENT' })
      .where(eq(portalUsers.id, existingPortalUser.id));
  }
  console.log(`✅ Client User Ready: ${clientEmail} / ${clientPassword}`);

  // ─── 3. SEED OPERATIONAL RECORDS FOR ACME CORPORATION ────────────────────
  const clientId = clientProfile.id;

  // Clear existing operational records for clean re-seed
  await db.delete(portalEngagements).where(eq(portalEngagements.clientId, clientId));

  console.log('Populating Engagements...');
  const [eng1] = await db
    .insert(portalEngagements)
    .values({
      clientId,
      title: 'Q3 Tax Advisory & Global Transfer Pricing',
      serviceCategory: 'Tax & Fiscal Advisory',
      description: 'Cross-border international tax structuring and global transfer pricing compliance.',
      status: 'ACTIVE',
      startDate: '2024-07-01',
      endDate: '2024-12-31',
    })
    .returning();

  const [eng2] = await db
    .insert(portalEngagements)
    .values({
      clientId,
      title: 'Annual Corporate Financial Audit 2024',
      serviceCategory: 'Risk & Assurance',
      description: 'Statutory audit of balance sheet, income statements, and internal financial controls.',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    })
    .returning();

  const [eng3] = await db
    .insert(portalEngagements)
    .values({
      clientId,
      title: 'ESG Governance & Regulatory Framework',
      serviceCategory: 'Regulatory Advisory',
      description: 'ESG sustainability disclosure reporting and corporate governance compliance.',
      status: 'ACTIVE',
      startDate: '2024-06-01',
      endDate: '2024-11-30',
    })
    .returning();

  console.log('Populating Tasks...');
  await db.insert(portalTasks).values([
    {
      clientId,
      engagementId: eng1.id,
      name: 'Submit Q3 Trial Balance & Financial Statements',
      dueDate: '2024-10-20',
      status: 'UPCOMING',
      priority: 'HIGH',
    },
    {
      clientId,
      engagementId: eng2.id,
      name: 'Review Draft Audit Plan & Management Representation',
      dueDate: '2024-10-15',
      status: 'DUE SOON',
      priority: 'URGENT',
    },
    {
      clientId,
      engagementId: eng1.id,
      name: 'Upload Foreign Subsidiary Tax Returns',
      dueDate: '2024-11-05',
      status: 'UPCOMING',
      priority: 'NORMAL',
    },
    {
      clientId,
      engagementId: eng3.id,
      name: 'Confirm Directors Board Resolutions for Q3',
      dueDate: '2024-11-12',
      status: 'UPCOMING',
      priority: 'NORMAL',
    },
  ]);

  console.log('Populating Compliance Calendar...');
  await db.insert(portalComplianceItems).values([
    {
      clientId,
      engagementId: eng1.id,
      requirement: 'Corporate Income Tax Return Filing (Q3)',
      dueDate: '2024-10-31',
      status: 'PENDING',
      notes: 'Statutory quarterly corporate income tax filing with tax authorities.',
    },
    {
      clientId,
      engagementId: eng1.id,
      requirement: 'VAT & Quarterly Sales Tax Return Q3',
      dueDate: '2024-11-15',
      status: 'PENDING',
      notes: 'Quarterly value added tax summary report.',
    },
    {
      clientId,
      engagementId: eng2.id,
      requirement: 'Annual Statutory Financial Return 2024',
      dueDate: '2024-12-15',
      status: 'PENDING',
      notes: 'Final audited financial statements submission.',
    },
  ]);

  console.log('Populating Documents...');
  await db.insert(portalDocuments).values([
    {
      clientId,
      engagementId: eng1.id,
      title: 'Q3 Financial Statements Draft.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'pdf',
      fileSize: '2.4 MB',
      category: 'Tax Advisory',
      status: 'APPROVED',
      uploadedBy: adminUser.id,
    },
    {
      clientId,
      engagementId: eng2.id,
      title: 'Draft Engagement Letter 2024-2025.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'pdf',
      fileSize: '1.1 MB',
      category: 'Engagement',
      status: 'APPROVED',
      uploadedBy: adminUser.id,
    },
    {
      clientId,
      engagementId: eng1.id,
      title: 'Trial Balance Worksheet Q3.xlsx',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'xlsx',
      fileSize: '540 KB',
      category: 'Client Upload',
      status: 'PENDING_REVIEW',
      uploadedBy: clientUser.id,
    },
  ]);

  console.log('Populating Invoices & Payments...');
  const [inv1] = await db
    .insert(portalInvoices)
    .values({
      clientId,
      engagementId: eng1.id,
      invoiceNumber: 'INV-2024-089',
      amount: '$8,500.00',
      issueDate: '2024-10-01',
      dueDate: '2024-10-15',
      status: 'UNPAID',
      notes: 'Q3 Tax Advisory & Global Transfer Pricing fee.',
    })
    .returning();

  const [inv2] = await db
    .insert(portalInvoices)
    .values({
      clientId,
      engagementId: eng2.id,
      invoiceNumber: 'INV-2024-072',
      amount: '$4,200.00',
      issueDate: '2024-09-01',
      dueDate: '2024-09-15',
      status: 'PAID',
      notes: 'Interim Financial Audit Retainer Fee.',
    })
    .returning();

  await db.insert(portalPayments).values({
    clientId,
    invoiceId: inv2.id,
    paymentRef: 'PAY-2024-041',
    amount: '$4,200.00',
    paymentDate: '2024-09-14',
    paymentMethod: 'Wire Transfer',
    status: 'COMPLETED',
  });

  console.log('Populating Meetings...');
  await db.insert(portalMeetings).values({
    clientId,
    title: 'Q3 Audit Review & Tax Compliance Alignment',
    requestedDate: '2024-10-12',
    timeSlot: '02:00 PM - 03:00 PM',
    notes: 'Review Q3 audit plan and finalize international tax strategy.',
    status: 'CONFIRMED',
    meetingUrl: 'https://meet.google.com/psc-audit-review',
  });

  console.log('Populating Reports...');
  await db.insert(portalReports).values([
    {
      clientId,
      engagementId: eng2.id,
      title: 'Q2 Audit Summary & Financial Analysis',
      period: 'Q2 2024',
      publicationDate: '2024-07-15',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      summary: 'Comprehensive review of Q2 financial metrics, balance sheet changes, and internal accounting controls.',
    },
    {
      clientId,
      engagementId: eng1.id,
      title: 'Global Tax Strategy & Minimum Tax Regime Outlook',
      period: 'FY 2024',
      publicationDate: '2024-08-01',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      summary: 'Strategic advisory briefing on global pillar 2 tax implications and compliance checklist.',
    },
  ]);

  console.log('Populating Support Tickets...');
  const [ticket] = await db
    .insert(portalSupportTickets)
    .values({
      ticketNumber: 'TICK-849201',
      clientId,
      subject: 'Tax Return Filing Timeline Clarification',
      category: 'Tax & Advisory',
      priority: 'HIGH',
      status: 'OPEN',
    })
    .returning();

  await db.insert(portalTicketReplies).values([
    {
      ticketId: ticket.id,
      senderId: clientUser.id,
      senderType: 'CLIENT',
      message: 'Could you please clarify the exact deadline for filing our Q3 international tax returns and related disclosures?',
    },
    {
      ticketId: ticket.id,
      senderId: adminUser.id,
      senderType: 'PORTAL_ADMIN',
      message: 'Hello Sarah, our tax advisory team is reviewing your filing schedule. The standard deadline is Oct 31, 2024.',
    },
  ]);

  console.log('🎉 DEMO DATA SEEDED SUCCESSFULLY!');
  console.log('----------------------------------------------------');
  console.log('🔑 PORTAL ADMIN CREDENTIALS:');
  console.log('   Email:    admin@gmail.com');
  console.log('   Password: admin123');
  console.log('   URL:      /client-portal/login -> /client-portal/admin');
  console.log('----------------------------------------------------');
  console.log('🔑 CLIENT DEMO CREDENTIALS:');
  console.log('   Company:  Acme Corporation');
  console.log('   Email:    client@gmail.com');
  console.log('   Password: client123');
  console.log('   URL:      /client-portal/login -> /client-portal');
  console.log('----------------------------------------------------');

  process.exit(0);
}

seedPortalDemo().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
