/**
 * Square Payment Integration
 * Creates payment links for confirmed bookings
 */

const SQUARE_API_BASE = 'https://connect.squareup.com/v2';
const SQUARE_ACCESS_TOKEN = import.meta.env.VITE_SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

export interface PaymentLinkData {
  customerName: string;
  customerEmail: string;
  serviceType: string;
  amount: number; // in AUD
  referenceId: string;
  description?: string;
}

export interface SquarePaymentLinkResponse {
  success: boolean;
  paymentLink?: string;
  orderId?: string;
  error?: string;
}

export interface SquareInvoiceData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;

  // Invoice items
  items: {
    name: string;
    description?: string;
    quantity: number;
    amount: number; // per unit in AUD
  }[];

  // Terms
  dueDate?: string; // ISO date
  paymentTerms?: string;
  serviceTerms?: string;

  // References
  referenceId: string;
  invoiceNumber?: string;

  // Notes
  note?: string;
}

export interface SquareInvoiceResponse {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Create a Square payment link for a booking
 * Note: This requires a backend API endpoint to keep Square credentials secure
 */
export const createPaymentLink = async (
  data: PaymentLinkData
): Promise<SquarePaymentLinkResponse> => {
  try {
    // Call your n8n webhook which handles Square API integration
    const n8nWebhookUrl = 'https://nioctibinu.online/webhook/create-payment-link';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        serviceType: data.serviceType,
        amount: data.amount,
        referenceId: data.referenceId,
        description: data.description || `${data.serviceType} - Clean Up Bros`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      paymentLink: result.payment_link?.url,
      orderId: result.order?.id,
    };
  } catch (error) {
    console.error('Square payment link creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Backend implementation example (for n8n or Supabase Edge Function)
 * This code should run on your backend, not in the browser!
 */
export const createSquarePaymentLinkBackend = async (data: PaymentLinkData) => {
  const response = await fetch(`${SQUARE_API_BASE}/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Square-Version': '2024-12-18',
      'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idempotency_key: data.referenceId,
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: [
          {
            name: data.serviceType,
            quantity: '1',
            base_price_money: {
              amount: Math.round(data.amount * 100), // Convert to cents
              currency: 'AUD',
            },
            note: data.description,
          },
        ],
        customer_id: undefined, // Optional: create customer in Square first
      },
      checkout_options: {
        redirect_url: 'https://cleanupbros.com.au/payment-success',
        merchant_support_email: 'cleanupbros.au@gmail.com',
        ask_for_shipping_address: false,
        enable_loyalty: false,
      },
      pre_populated_data: {
        buyer_email: data.customerEmail,
        buyer_phone_number: undefined, // Optional
      },
    }),
  });

  return await response.json();
};

/**
 * Create a Square Invoice with service terms
 * Clients can review, sign (accept), and pay the invoice
 */
export const createSquareInvoice = async (
  data: SquareInvoiceData
): Promise<SquareInvoiceResponse> => {
  try {
    // Call n8n webhook which handles Square Invoices API integration
    const n8nWebhookUrl = 'https://nioctibinu.online/webhook/create-square-invoice';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerCompany: data.customerCompany,
        items: data.items,
        dueDate: data.dueDate,
        paymentTerms: data.paymentTerms,
        serviceTerms: data.serviceTerms,
        referenceId: data.referenceId,
        invoiceNumber: data.invoiceNumber,
        note: data.note,
      }),
    });

    if (!response.ok) {
      throw new Error(`Square Invoice API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      invoiceId: result.invoice?.id,
      invoiceNumber: result.invoice?.invoice_number,
      invoiceUrl: result.invoice?.invoice_url,
      publicUrl: result.invoice?.public_url,
    };
  } catch (error) {
    console.error('Square invoice creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Backend implementation for Square Invoices (for n8n)
 * This creates a proper Square Invoice with payment terms
 */
export const createSquareInvoiceBackend = async (data: SquareInvoiceData) => {
  // First, create or get customer
  const customerResponse = await fetch(`${SQUARE_API_BASE}/customers`, {
    method: 'POST',
    headers: {
      'Square-Version': '2024-12-18',
      'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idempotency_key: `customer-${data.referenceId}`,
      email_address: data.customerEmail,
      given_name: data.customerName.split(' ')[0],
      family_name: data.customerName.split(' ').slice(1).join(' '),
      phone_number: data.customerPhone,
      company_name: data.customerCompany,
    }),
  });

  const customerData = await customerResponse.json();
  const customerId = customerData.customer?.id;

  // Calculate due date (default 14 days from now)
  const dueDate = data.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Create invoice
  const invoiceResponse = await fetch(`${SQUARE_API_BASE}/invoices`, {
    method: 'POST',
    headers: {
      'Square-Version': '2024-12-18',
      'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idempotency_key: data.referenceId,
      invoice: {
        location_id: SQUARE_LOCATION_ID,
        order_id: undefined, // Created automatically
        primary_recipient: {
          customer_id: customerId,
        },
        payment_requests: [
          {
            request_type: 'BALANCE',
            due_date: dueDate,
            automatic_payment_source: 'NONE',
          },
        ],
        delivery_method: 'EMAIL',
        invoice_number: data.invoiceNumber,
        title: data.items[0]?.name || 'Cleaning Service',
        description: data.note,
        custom_fields: data.serviceTerms ? [
          {
            label: 'Service Terms',
            value: data.serviceTerms.substring(0, 500), // Square has character limits
          }
        ] : undefined,
      },
      // Add line items through the order
      fields_to_clear: [],
    }),
  });

  const invoiceData = await invoiceResponse.json();

  // Now add line items to the invoice's order
  if (invoiceData.invoice?.order_id) {
    await fetch(`${SQUARE_API_BASE}/orders/${invoiceData.invoice.order_id}`, {
      method: 'PUT',
      headers: {
        'Square-Version': '2024-12-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          location_id: SQUARE_LOCATION_ID,
          line_items: data.items.map(item => ({
            name: item.name,
            note: item.description,
            quantity: item.quantity.toString(),
            base_price_money: {
              amount: Math.round(item.amount * 100), // Convert to cents
              currency: 'AUD',
            },
          })),
        },
      }),
    });
  }

  // Publish the invoice so it can be sent
  if (invoiceData.invoice?.id) {
    await fetch(`${SQUARE_API_BASE}/invoices/${invoiceData.invoice.id}/publish`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-12-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: invoiceData.invoice.version,
        idempotency_key: `publish-${data.referenceId}`,
      }),
    });
  }

  return invoiceData;
};

/**
 * Verify Square webhook signature
 * Use this to validate webhooks from Square
 */
export const verifySquareWebhook = (
  webhookUrl: string,
  requestBody: string,
  signatureHeader: string
): boolean => {
  // Square webhook verification logic
  // See: https://developer.squareup.com/docs/webhooks/step3validate

  const crypto = require('crypto');
  const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  const hmac = crypto.createHmac('sha256', SQUARE_WEBHOOK_SIGNATURE_KEY);
  hmac.update(webhookUrl + requestBody);
  const expectedSignature = hmac.digest('base64');

  return expectedSignature === signatureHeader;
};

/**
 * Handle Square webhook events
 */
export const handleSquareWebhook = async (event: any) => {
  switch (event.type) {
    case 'payment.created':
      console.log('Payment created:', event.data.object.payment);
      // Update Supabase submission status to "Paid"
      break;

    case 'payment.updated':
      console.log('Payment updated:', event.data.object.payment);
      if (event.data.object.payment.status === 'COMPLETED') {
        // Send confirmation email
        // Update booking status
        // Notify admin via Telegram
      }
      break;

    case 'order.created':
      console.log('Order created:', event.data.object.order);
      break;

    default:
      console.log('Unhandled Square event type:', event.type);
  }
};
