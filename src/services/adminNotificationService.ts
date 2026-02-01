/**
 * Admin Notification Service - Clean Up Bros
 * 
 * Unified notification service for all admin actions:
 * - Bookings (scheduled, completed, cancelled)
 * - Invoices (created, paid, overdue)
 * - Gift Cards (purchased, redeemed)
 * - Complaints (new, resolved)
 * - Team (new member, status change)
 * 
 * Created: February 2, 2026
 */

import { sendTelegramMessage } from './telegramService';

const ADMIN_PHONE = '+61415429117';
const SMS_API_URL = '/api/send-sms';

// ============== BOOKING NOTIFICATIONS ==============

export const notifyBookingScheduled = async (data: {
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
  date: string;
  time: string;
  price: number;
  assignedTeam?: string;
  referenceId: string;
}): Promise<void> => {
  await sendTelegramMessage(`
📅 <b>BOOKING SCHEDULED</b>

👤 <b>Customer:</b> ${data.customerName}
📱 <b>Phone:</b> ${data.phone}
📍 <b>Address:</b> ${data.address}
🧹 <b>Service:</b> ${data.serviceType}
📆 <b>Date:</b> ${data.date} at ${data.time}
💰 <b>Price:</b> $${data.price}
${data.assignedTeam ? `👷 <b>Team:</b> ${data.assignedTeam}` : ''}
🔗 <b>Ref:</b> <code>${data.referenceId}</code>
  `.trim());
};

export const notifyBookingCompleted = async (data: {
  customerName: string;
  serviceType: string;
  price: number;
  referenceId: string;
}): Promise<void> => {
  await sendTelegramMessage(`
✅ <b>JOB COMPLETED</b>

👤 <b>Customer:</b> ${data.customerName}
🧹 <b>Service:</b> ${data.serviceType}
💰 <b>Amount:</b> $${data.price}
🔗 <b>Ref:</b> <code>${data.referenceId}</code>

<i>Invoice sent to customer</i>
  `.trim());
};

export const notifyBookingCancelled = async (data: {
  customerName: string;
  serviceType: string;
  date: string;
  reason?: string;
  referenceId: string;
}): Promise<void> => {
  await sendTelegramMessage(`
❌ <b>BOOKING CANCELLED</b>

👤 <b>Customer:</b> ${data.customerName}
🧹 <b>Service:</b> ${data.serviceType}
📆 <b>Was scheduled:</b> ${data.date}
${data.reason ? `📝 <b>Reason:</b> ${data.reason}` : ''}
🔗 <b>Ref:</b> <code>${data.referenceId}</code>
  `.trim());
};

// ============== INVOICE NOTIFICATIONS ==============

export const notifyInvoiceCreated = async (data: {
  customerName: string;
  email: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
}): Promise<void> => {
  await sendTelegramMessage(`
🧾 <b>INVOICE CREATED</b>

👤 <b>Customer:</b> ${data.customerName}
📧 <b>Email:</b> ${data.email}
🔢 <b>Invoice #:</b> ${data.invoiceNumber}
💰 <b>Amount:</b> $${data.amount}
📅 <b>Due:</b> ${data.dueDate}

<i>Invoice sent to customer email</i>
  `.trim());
};

export const notifyInvoicePaid = async (data: {
  customerName: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod?: string;
}): Promise<void> => {
  await sendTelegramMessage(`
💵 <b>PAYMENT RECEIVED</b>

👤 <b>Customer:</b> ${data.customerName}
🔢 <b>Invoice #:</b> ${data.invoiceNumber}
💰 <b>Amount:</b> $${data.amount}
${data.paymentMethod ? `💳 <b>Method:</b> ${data.paymentMethod}` : ''}

✅ <i>Invoice marked as paid</i>
  `.trim());
};

export const notifyInvoiceOverdue = async (data: {
  customerName: string;
  phone: string;
  invoiceNumber: string;
  amount: number;
  daysOverdue: number;
}): Promise<void> => {
  await sendTelegramMessage(`
⚠️ <b>INVOICE OVERDUE</b>

👤 <b>Customer:</b> ${data.customerName}
📱 <b>Phone:</b> ${data.phone}
🔢 <b>Invoice #:</b> ${data.invoiceNumber}
💰 <b>Amount:</b> $${data.amount}
⏰ <b>Days overdue:</b> ${data.daysOverdue}

<i>Follow up recommended</i>
  `.trim());
};

// ============== GIFT CARD NOTIFICATIONS ==============

export const notifyGiftCardPurchased = async (data: {
  purchaserName: string;
  purchaserEmail: string;
  recipientName?: string;
  amount: number;
  cardCode: string;
}): Promise<void> => {
  await sendTelegramMessage(`
🎁 <b>GIFT CARD PURCHASED</b>

👤 <b>Buyer:</b> ${data.purchaserName}
📧 <b>Email:</b> ${data.purchaserEmail}
${data.recipientName ? `🎀 <b>Recipient:</b> ${data.recipientName}` : ''}
💰 <b>Value:</b> $${data.amount}
🔑 <b>Code:</b> <code>${data.cardCode}</code>

<i>Card delivered via email</i>
  `.trim());
};

export const notifyGiftCardRedeemed = async (data: {
  customerName: string;
  cardCode: string;
  amountUsed: number;
  remainingBalance: number;
  bookingRef?: string;
}): Promise<void> => {
  await sendTelegramMessage(`
🎉 <b>GIFT CARD REDEEMED</b>

👤 <b>Customer:</b> ${data.customerName}
🔑 <b>Card:</b> <code>${data.cardCode}</code>
💰 <b>Used:</b> $${data.amountUsed}
💳 <b>Remaining:</b> $${data.remainingBalance}
${data.bookingRef ? `🔗 <b>Booking:</b> ${data.bookingRef}` : ''}
  `.trim());
};

// ============== COMPLAINT NOTIFICATIONS ==============

export const notifyNewComplaint = async (data: {
  customerName: string;
  phone: string;
  type: string;
  priority: string;
  description: string;
  bookingRef?: string;
  complaintId: string;
}): Promise<void> => {
  const priorityEmoji = {
    urgent: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
  }[data.priority] || '⚪';

  await sendTelegramMessage(`
🚨 <b>NEW COMPLAINT</b> ${priorityEmoji}

👤 <b>Customer:</b> ${data.customerName}
📱 <b>Phone:</b> ${data.phone}
📋 <b>Type:</b> ${data.type}
⚡ <b>Priority:</b> ${data.priority.toUpperCase()}
${data.bookingRef ? `🔗 <b>Booking:</b> ${data.bookingRef}` : ''}

💬 <b>Issue:</b>
${data.description.slice(0, 200)}${data.description.length > 200 ? '...' : ''}

🆔 <b>Complaint ID:</b> <code>${data.complaintId}</code>
  `.trim());
};

export const notifyComplaintResolved = async (data: {
  customerName: string;
  type: string;
  resolution: string;
  refundAmount?: number;
  recleanOffered?: boolean;
  complaintId: string;
}): Promise<void> => {
  await sendTelegramMessage(`
✅ <b>COMPLAINT RESOLVED</b>

👤 <b>Customer:</b> ${data.customerName}
📋 <b>Type:</b> ${data.type}
${data.refundAmount ? `💰 <b>Refund:</b> $${data.refundAmount}` : ''}
${data.recleanOffered ? `🧹 <b>Reclean:</b> Offered` : ''}

📝 <b>Resolution:</b>
${data.resolution.slice(0, 200)}

🆔 <code>${data.complaintId}</code>
  `.trim());
};

// ============== TEAM NOTIFICATIONS ==============

export const notifyTeamMemberAdded = async (data: {
  name: string;
  role: string;
  phone: string;
  skills: string[];
}): Promise<void> => {
  await sendTelegramMessage(`
👷 <b>NEW TEAM MEMBER</b>

👤 <b>Name:</b> ${data.name}
🎭 <b>Role:</b> ${data.role}
📱 <b>Phone:</b> ${data.phone}
🔧 <b>Skills:</b> ${data.skills.join(', ') || 'None specified'}
  `.trim());
};

export const notifyTeamMemberStatusChange = async (data: {
  name: string;
  oldStatus: string;
  newStatus: string;
}): Promise<void> => {
  const statusEmoji = {
    active: '✅',
    inactive: '⏸️',
    on_leave: '🏖️',
  }[data.newStatus] || '❓';

  await sendTelegramMessage(`
${statusEmoji} <b>TEAM STATUS CHANGE</b>

👤 <b>Name:</b> ${data.name}
📊 <b>Status:</b> ${data.oldStatus} → <b>${data.newStatus}</b>
  `.trim());
};

// ============== CONTRACT NOTIFICATIONS ==============

export const notifyContractSigned = async (data: {
  customerName: string;
  contractType: string;
  startDate: string;
  value: number;
  referenceId: string;
}): Promise<void> => {
  await sendTelegramMessage(`
📝 <b>CONTRACT SIGNED</b>

👤 <b>Customer:</b> ${data.customerName}
📄 <b>Type:</b> ${data.contractType}
📅 <b>Start:</b> ${data.startDate}
💰 <b>Value:</b> $${data.value}
🔗 <b>Ref:</b> <code>${data.referenceId}</code>

✅ <i>Contract is now active</i>
  `.trim());
};

// ============== DAILY SUMMARY ==============

export const sendDailySummary = async (data: {
  date: string;
  newLeads: number;
  bookingsToday: number;
  completedJobs: number;
  revenue: number;
  pendingInvoices: number;
  openComplaints: number;
}): Promise<void> => {
  await sendTelegramMessage(`
📊 <b>DAILY SUMMARY - ${data.date}</b>

📥 <b>New Leads:</b> ${data.newLeads}
📅 <b>Bookings Today:</b> ${data.bookingsToday}
✅ <b>Completed Jobs:</b> ${data.completedJobs}
💰 <b>Revenue:</b> $${data.revenue.toFixed(2)}
📄 <b>Pending Invoices:</b> ${data.pendingInvoices}
🚨 <b>Open Complaints:</b> ${data.openComplaints}

<i>Have a great day! 💪</i>
  `.trim());
};

export default {
  // Bookings
  notifyBookingScheduled,
  notifyBookingCompleted,
  notifyBookingCancelled,
  // Invoices
  notifyInvoiceCreated,
  notifyInvoicePaid,
  notifyInvoiceOverdue,
  // Gift Cards
  notifyGiftCardPurchased,
  notifyGiftCardRedeemed,
  // Complaints
  notifyNewComplaint,
  notifyComplaintResolved,
  // Team
  notifyTeamMemberAdded,
  notifyTeamMemberStatusChange,
  // Contracts
  notifyContractSigned,
  // Summary
  sendDailySummary,
};
