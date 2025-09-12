import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  constructor() {
    this.doc = new jsPDF();
    this.companyName = 'Gems of Insight';
    this.companyTagline = 'Your Health, Our Priority';
    this.companyAddress = 'Nairobi, Kenya';
    this.companyEmail = 'info@gemsofinsight.com';
    this.companyPhone = '+254 700 000 000';
    this.companyWebsite = 'www.gemsofinsight.com';
  }

  // --- Tailwind Printable HTML Helpers ---
  buildHtmlShell(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body class="bg-white text-gray-900">
  <div class="mx-auto max-w-4xl p-6">
    ${body}
    <div class="mt-6 border-t border-emerald-100 pt-3 text-center text-xs text-gray-500">
      © ${new Date().getFullYear()} Gems of Insight. All rights reserved.
    </div>
  </div>
  <script>window.onload = () => { setTimeout(() => window.print(), 150); };</script>
  </body>
</html>`;
  }

  openPrint(html) {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // --- Admin Inquiries (Printable) ---
  printInquiry(contact) {
    const body = `
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">${this.companyName}</h1>
          <div class="text-sm text-gray-600">${this.companyTagline}</div>
        </div>
        <div class="text-right text-sm text-gray-600">
          <div>${this.companyEmail}</div>
          <div>${this.companyPhone}</div>
        </div>
      </div>
      <div class="rounded-xl border border-emerald-100 bg-white p-4">
        <h2 class="mb-3 text-lg font-semibold text-emerald-700">Inquiry Details</h2>
        <div class="grid gap-3 sm:grid-cols-2 text-sm">
          <div><div class="text-gray-500">Name</div><div class="font-medium">${contact?.full_name || contact?.name || 'N/A'}</div></div>
          <div><div class="text-gray-500">Email</div><div class="font-medium">${contact?.email || 'N/A'}</div></div>
          <div><div class="text-gray-500">Phone</div><div class="font-medium">${contact?.phone_number || contact?.phone || 'N/A'}</div></div>
          <div><div class="text-gray-500">Date</div><div class="font-medium">${new Date(contact?.created_at || Date.now()).toLocaleString()}</div></div>
        </div>
        <div class="mt-4">
          <div class="text-gray-500">Message</div>
          <div class="mt-1 whitespace-pre-wrap rounded-md border border-gray-100 bg-gray-50 p-3 text-sm">${(contact?.message || '').toString()}</div>
        </div>
      </div>`;
    this.openPrint(this.buildHtmlShell('Inquiry', body));
  }

  printInquiriesList(contacts, title = 'Inquiries List') {
    const rows = (contacts || []).map((c, i) => `
      <tr class="border-b border-gray-100">
        <td class="px-3 py-2 text-xs text-gray-600">${i + 1}</td>
        <td class="px-3 py-2 text-sm">${c.name || ''}</td>
        <td class="px-3 py-2 text-sm">${c.email || ''}</td>
        <td class="px-3 py-2 text-sm">${c.phone || ''}</td>
        <td class="px-3 py-2 text-xs text-gray-600">${new Date(c.created_at || Date.now()).toLocaleString()}</td>
      </tr>`).join('');
    const body = `
      <div class="mb-4">
        <h1 class="text-xl font-bold">${title}</h1>
        <div class="text-sm text-gray-600">Generated ${new Date().toLocaleString()}</div>
      </div>
      <table class="w-full table-auto border-collapse overflow-hidden rounded-md border border-gray-100">
        <thead class="bg-emerald-50 text-emerald-800">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Name</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Email</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Phone</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
    this.openPrint(this.buildHtmlShell(title, body));
  }

  // --- Appointments (Printable) ---
  printAppointment(appointment) {
    const info = [
      ['Full Name', appointment?.full_name],
      ['Email', appointment?.email],
      ['Phone', appointment?.phone_no || appointment?.phone],
      ['Concern', appointment?.health_concern],
      ['Preferred Date', appointment?.preferred_date],
      ['Preferred Time', appointment?.preferred_time]
    ]
      .map(([k, v]) => (
        `<div><div class="text-gray-500">${k}</div><div class="font-medium">${v || 'N/A'}</div></div>`
      )).join('');
    const body = `
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">Appointment</h1>
          <div class="text-sm text-gray-600">#${appointment?.id || 'N/A'} • ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 rounded-xl border border-emerald-100 bg-white p-4">${info}</div>`;
    this.openPrint(this.buildHtmlShell('Appointment', body));
  }

  printAppointmentsList(appointments, title = 'Appointments List') {
    const rows = (appointments || []).map((a, i) => `
      <tr class="border-b border-gray-100">
        <td class="px-3 py-2 text-xs text-gray-600">${i + 1}</td>
        <td class="px-3 py-2 text-sm">${a.full_name || ''}</td>
        <td class="px-3 py-2 text-sm">${a.email || ''}</td>
        <td class="px-3 py-2 text-sm">${a.phone_no || a.phone || ''}</td>
        <td class="px-3 py-2 text-sm">${a.health_concern || ''}</td>
        <td class="px-3 py-2 text-xs text-gray-600">${a.preferred_date || ''} ${a.preferred_time || ''}</td>
      </tr>`).join('');
    const body = `
      <div class="mb-4">
        <h1 class="text-xl font-bold">${title}</h1>
        <div class="text-sm text-gray-600">Generated ${new Date().toLocaleString()}</div>
      </div>
      <table class="w-full table-auto border-collapse overflow-hidden rounded-md border border-gray-100">
        <thead class="bg-emerald-50 text-emerald-800">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Name</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Email</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Phone</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Concern</th>
            <th class="px-3 py-2 text-left text-xs font-semibold">Preferred</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
    this.openPrint(this.buildHtmlShell(title, body));
  }

  // --- Payments / Transactions (Printable HTML) ---
  printTransactionReceipt(transaction) {
    const user = transaction?.order?.user || {};
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'N/A';
    const orderItems = (transaction?.order?.items || []).map((it, idx) => `
      <tr class="border-b border-gray-100">
        <td class="px-3 py-2 text-sm">${idx + 1}</td>
        <td class="px-3 py-2 text-sm">${it?.item?.name || it?.item?.title || 'Item'}</td>
        <td class="px-3 py-2 text-sm">${it?.quantity ?? 1}</td>
      </tr>`).join('');

    const body = `
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">${this.companyName}</h1>
          <div class="text-sm text-gray-600">Payment Receipt</div>
        </div>
        <div class="text-right text-sm text-gray-600">
          <div>${this.companyEmail}</div>
          <div>${this.companyPhone}</div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 class="mb-2 text-sm font-semibold text-emerald-700">Payer</h2>
          <div class="text-sm"><span class="text-gray-500">Name:</span> <span class="font-medium">${fullName}</span></div>
          <div class="text-sm"><span class="text-gray-500">Email:</span> <span class="font-medium">${user.email || 'N/A'}</span></div>
        </div>
        <div class="rounded-xl border border-emerald-100 bg-white p-4">
          <h2 class="mb-2 text-sm font-semibold text-emerald-700">Payment</h2>
          <div class="text-sm"><span class="text-gray-500">Transaction ID:</span> <span class="font-medium">${transaction?.id || '—'}</span></div>
          <div class="text-sm"><span class="text-gray-500">Status:</span> <span class="font-medium">${transaction?.status || '—'}</span></div>
          <div class="text-sm"><span class="text-gray-500">Amount:</span> <span class="font-medium">KES ${Number(transaction?.amount || 0).toFixed(2)}</span></div>
          <div class="text-sm"><span class="text-gray-500">Phone:</span> <span class="font-medium">${transaction?.phone_number || '—'}</span></div>
          <div class="text-sm"><span class="text-gray-500">Receipt:</span> <span class="font-medium">${transaction?.mpesa_receipt_number || '—'}</span></div>
          <div class="text-sm"><span class="text-gray-500">Date:</span> <span class="font-medium">${new Date(transaction?.transaction_date || Date.now()).toLocaleString()}</span></div>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-emerald-100 bg-white p-4">
        <h2 class="mb-2 text-sm font-semibold text-emerald-700">Order</h2>
        <div class="grid gap-3 sm:grid-cols-2 text-sm mb-3">
          <div><span class="text-gray-500">Order ID:</span> <span class="font-medium">${transaction?.order?.id || '—'}</span></div>
          <div><span class="text-gray-500">Order Status:</span> <span class="font-medium">${transaction?.order?.status || '—'}</span></div>
        </div>
        <table class="w-full table-auto border-collapse overflow-hidden rounded-md border border-gray-100">
          <thead class="bg-emerald-50 text-emerald-800">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
              <th class="px-3 py-2 text-left text-xs font-semibold">Item</th>
              <th class="px-3 py-2 text-left text-xs font-semibold">Qty</th>
            </tr>
          </thead>
          <tbody>${orderItems || ''}</tbody>
        </table>
      </div>`;

    this.openPrint(this.buildHtmlShell('Payment Receipt', body));
  }

  // --- Payments / Transactions (PDF) ---
  generateTransactionPDF(transaction) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primary = [46, 125, 50];
    const secondary = [31, 41, 55];
    const subtle = [241, 245, 249];

    this.addHeader(doc, pageWidth);

    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', pageWidth / 2, 85, { align: 'center' });

    // Status badge
    const status = (transaction?.status || 'unknown').toString().toLowerCase();
    const statusMap = {
      success: { fill: [220, 252, 231], text: [22, 101, 52], border: [187, 247, 208], label: 'SUCCESS' },
      failed: { fill: [254, 226, 226], text: [153, 27, 27], border: [254, 202, 202], label: 'FAILED' },
      pending: { fill: [255, 247, 237], text: [154, 52, 18], border: [254, 215, 170], label: 'PENDING' }
    };
    const st = statusMap[status] || { fill: [243, 244, 246], text: [31, 41, 55], border: [229, 231, 235], label: status.toUpperCase() };
    doc.setFillColor(...st.fill);
    doc.setDrawColor(...st.border);
    doc.roundedRect(pageWidth / 2 - 20, 92, 40, 10, 3, 3, 'FD');
    doc.setTextColor(...st.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(st.label, pageWidth / 2, 99, { align: 'center' });

    // Divider
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.8);
    doc.line(20, 105, pageWidth - 20, 105);

    // Two-column cards: Payer and Payment
    const user = transaction?.order?.user || {};
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'N/A';

    const cardY = 112;
    const cardW = (pageWidth - 20 - 20 - 6) / 2; // margins 20 each, gap 6

    // Payer card
    doc.setFillColor(...subtle);
    doc.roundedRect(20, cardY, cardW, 36, 3, 3, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(20, cardY, cardW, 36, 3, 3, 'S');
    doc.setFontSize(12);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Payer', 26, cardY + 8);
    doc.setFontSize(10);
    doc.setTextColor(...secondary);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${fullName}`, 26, cardY + 16);
    doc.text(`Email: ${user.email || 'N/A'}`, 26, cardY + 24);
    doc.text(`Phone: ${transaction?.phone_number || '—'}`, 26, cardY + 32);

    // Payment card
    const rightX = 20 + cardW + 6;
    doc.setFillColor(...subtle);
    doc.roundedRect(rightX, cardY, cardW, 36, 3, 3, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(rightX, cardY, cardW, 36, 3, 3, 'S');
    doc.setFontSize(12);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment', rightX + 6, cardY + 8);
    doc.setFontSize(10);
    doc.setTextColor(...secondary);
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction ID: ${String(transaction?.id || '—')}`, rightX + 6, cardY + 16);
    doc.text(`Amount: KES ${Number(transaction?.amount || 0).toFixed(2)}`, rightX + 6, cardY + 24);
    doc.text(`Date: ${new Date(transaction?.transaction_date || Date.now()).toLocaleString()}`, rightX + 6, cardY + 32);

    // IDs row
    let y = cardY + 46;
    doc.setFontSize(11);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Identifiers', 20, y);
    y += 4;
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, pageWidth - 20, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(...secondary);
    doc.setFont('helvetica', 'normal');
    const idLines = [
      `Checkout: ${transaction?.checkout_request_id || '—'}`,
      `Merchant: ${transaction?.merchant_request_id || '—'}`,
      `Receipt: ${transaction?.mpesa_receipt_number || '—'}`
    ];
    idLines.forEach((line, i) => {
      doc.text(line, 20, y + (i * 6));
    });
    y += idLines.length * 6 + 6;

    // Order section with table
    const order = transaction?.order || {};
    doc.setFontSize(12);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Summary', 20, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(...secondary);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${order?.id || '—'}`, 20, y);
    doc.text(`Status: ${order?.status || '—'}`, 70, y);
    y += 6;

    const items = Array.isArray(order?.items) ? order.items : [];
    if (items.length > 0) {
      const body = items.map((it, idx) => [
        idx + 1,
        it?.item?.name || it?.item?.title || 'Item',
        it?.quantity ?? 1
      ]);
      doc.autoTable({
        head: [['#', 'Item', 'Qty']],
        body,
        startY: y,
        styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak', halign: 'left' },
        headStyles: { fillColor: primary, textColor: [255,255,255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 120 }, 2: { cellWidth: 20 } },
        margin: { left: 20, right: 20 }
      });
      y = doc.lastAutoTable.finalY + 8;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text('No line items available.', 20, y);
      y += 8;
    }

    // Total amount highlight
    doc.setFillColor(...subtle);
    doc.roundedRect(20, y, pageWidth - 40, 14, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID:', 25, y + 9);
    doc.setTextColor(...secondary);
    doc.setFont('helvetica', 'normal');
    doc.text(`KES ${Number(transaction?.amount || 0).toFixed(2)}`, pageWidth - 25, y + 9, { align: 'right' });

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);
    return doc;
  }

  downloadTransactionPDF(transaction) {
    const doc = this.generateTransactionPDF(transaction);
    const id = transaction?.id || 'txn';
    const filename = `receipt_${id}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.downloadPDF(doc, filename);
  }

  // --- User Profile (PDF) ---
  generateUserProfilePDF(user) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primary = [46, 125, 50];
    const secondary = [31, 41, 55];
    const subtle = [241, 245, 249];

    this.addHeader(doc, pageWidth);

    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('ACCOUNT PROFILE', pageWidth / 2, 85, { align: 'center' });

    // Divider
    doc.setDrawColor(...primary);
    doc.setLineWidth(1);
    doc.line(20, 95, pageWidth - 20, 95);

    // Build info
    const fullName = `${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`.trim() || 'N/A';
    const memberSince = user?.createdAt || user?.joinedDate || user?.date_joined || null;
    const fields = [
      ['Full Name', fullName],
      ['Email', user?.email || 'N/A'],
      ['Phone', user?.phone || user?.phone_number || 'N/A'],
      ['Role', user?.role || user?.userType || 'User'],
      ['Member Since', this.formatDate(memberSince)],
      ['Newsletter', (user?.newsletter ? 'Subscribed' : 'Not subscribed')]
    ];

    // Alternating info blocks
    let y = 110;
    fields.forEach(([label, value], idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(...subtle);
        doc.roundedRect(20, y - 10, pageWidth - 40, 20, 2, 2, 'F');
      }
      doc.setFontSize(11);
      doc.setTextColor(...primary);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 25, y);
      doc.setTextColor(...secondary);
      doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(String(value), pageWidth - 60);
      doc.text(wrapped, 80, y);
      y += Math.max(14, (wrapped.length * 6));
    });

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);
    return doc;
  }

  downloadUserProfilePDF(user) {
    const doc = this.generateUserProfilePDF(user);
    const name = `${user?.firstName || user?.first_name || 'user'}_${user?.lastName || user?.last_name || ''}`.trim().replace(/\s+/g, '_');
    const filename = `profile_${name || 'account'}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.downloadPDF(doc, filename);
  }

  // Generate a single inquiry PDF
  generateInquiryPDF(contact) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primary = [46, 125, 50];
    const secondary = [31, 41, 55];
    const subtle = [241, 245, 249];

    this.addHeader(doc, pageWidth);

    doc.setFontSize(24);
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.text('INQUIRY DETAILS', pageWidth / 2, 85, { align: 'center' });

    doc.setDrawColor(...primary);
    doc.setLineWidth(1);
    doc.line(20, 95, pageWidth - 20, 95);

    // Info blocks
    const info = [
      ['Full Name', contact.full_name || 'N/A'],
      ['Email', contact.email || 'N/A'],
      ['Phone Number', contact.phone_number || 'N/A'],
      ['Subject', contact.subject || 'N/A'],
      ['Message', contact.message || 'N/A']
    ];

    let y = 110;
    info.forEach(([label, value], idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(...subtle);
        doc.roundedRect(20, y - 10, pageWidth - 40, 20, 2, 2, 'F');
      }
      doc.setFontSize(11);
      doc.setTextColor(...primary);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 25, y);
      doc.setTextColor(...secondary);
      doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(String(value), pageWidth - 60);
      doc.text(wrapped, 80, y);
      y += Math.max(14, (wrapped.length * 6));
    });

    this.addFooter(doc, pageWidth, pageHeight);
    return doc;
  }

  downloadInquiryPDF(contact) {
    const doc = this.generateInquiryPDF(contact);
    const filename = `inquiry_${(contact.full_name || 'unknown').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.downloadPDF(doc, filename);
  }

  generateInquiriesListPDF(contacts, title = 'Inquiries List') {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    this.addHeader(doc, pageWidth);

    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), pageWidth / 2, 85, { align: 'center' });

    const body = contacts.map(c => [
      c.id,
      c.full_name || 'N/A',
      c.email || 'N/A',
      c.phone_number || 'N/A',
      c.subject || 'N/A',
      (c.message || '').slice(0, 80)
    ]);

    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message']],
      body,
      startY: 100,
      styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak', halign: 'left' },
      headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 2: { cellWidth: 40 }, 3: { cellWidth: 28 }, 4: { cellWidth: 30 }, 5: { cellWidth: 50 } }
    });

    this.addFooter(doc, pageWidth, pageHeight);
    return doc;
  }

  downloadInquiriesListPDF(contacts, title = 'Inquiries List') {
    const doc = this.generateInquiriesListPDF(contacts, title);
    const filename = `inquiries_${new Date().toISOString().split('T')[0]}.pdf`;
    this.downloadPDF(doc, filename);
  }

  // Generate a single appointment PDF with enhanced styling
  generateAppointmentPDF(appointment) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors
    const primaryColor = [107, 142, 35]; // #6b8e23
    const secondaryColor = [52, 73, 94]; // #34495e
    const lightGray = [236, 240, 241]; // #ecf0f1
    const accentColor = [255, 193, 7]; // #ffc107
    
    // Header with logo and company info
    this.addHeader(doc, pageWidth);
    
    // Title with enhanced styling
    doc.setFontSize(26);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('APPOINTMENT DETAILS', pageWidth / 2, 85, { align: 'center' });
    
    // Appointment ID and Date with better layout
    doc.setFontSize(11);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    
    // Left side - Appointment ID
    doc.setFillColor(...lightGray);
    doc.roundedRect(20, 95, 80, 12, 2, 2, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointment ID:', 25, 102);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${appointment.id || 'N/A'}`, 25, 108);
    
    // Right side - Generation date
    doc.setFillColor(...lightGray);
    doc.roundedRect(pageWidth - 100, 95, 80, 12, 2, 2, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Generated:', pageWidth - 95, 102);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString(), pageWidth - 95, 108);
    
    // Line separator with enhanced styling
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 115, pageWidth - 20, 115);
    
    // Patient Information Section with enhanced styling
    this.addEnhancedSectionHeader(doc, '👤 PATIENT INFORMATION', 130);
    
    const patientInfo = [
      ['Full Name', appointment.full_name || 'N/A'],
      ['Email Address', appointment.email || 'N/A'],
      ['Phone Number', appointment.phone_no || 'N/A'],
      ['Health Concern', appointment.health_concern || 'N/A']
    ];
    
    this.addEnhancedInfoTable(doc, patientInfo, 140);
    
    // Appointment Details Section
    this.addEnhancedSectionHeader(doc, '📅 APPOINTMENT DETAILS', 190);
    
    const appointmentInfo = [
      ['Preferred Date', this.formatDate(appointment.preferred_date)],
      ['Preferred Time', this.formatTime(appointment.preferred_time)],
      ['Status', this.formatStatus(appointment.status)],
      ['Booking Date', new Date(appointment.created_at).toLocaleString()]
    ];
    
    this.addEnhancedInfoTable(doc, appointmentInfo, 200);
    
    // Additional Notes Section with enhanced styling
    if (appointment.additional_notes) {
      this.addEnhancedSectionHeader(doc, '📝 ADDITIONAL NOTES', 250);
      
      // Notes box with background
      doc.setFillColor(255, 255, 240);
      doc.roundedRect(20, 260, pageWidth - 40, 30, 3, 3, 'F');
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(20, 260, pageWidth - 40, 30, 3, 3, 'S');
      
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'normal');
      
      const splitNotes = doc.splitTextToSize(appointment.additional_notes, pageWidth - 50);
      doc.text(splitNotes, 25, 270);
    }
    
    // Footer
    this.addFooter(doc, pageWidth, pageHeight);
    
    return doc;
  }

  // Generate multiple appointments PDF with enhanced styling
  generateAppointmentsListPDF(appointments, title = 'Appointments List') {
    console.log('📄 PDF Service - Starting PDF generation');
    console.log('📊 Appointments to process:', appointments.length);
    console.log('📋 Title:', title);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
    
      // Header
      this.addHeader(doc, pageWidth);
      
      // Title with enhanced styling
      doc.setFontSize(22);
      doc.setTextColor(107, 142, 35);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), pageWidth / 2, 85, { align: 'center' });
      
      // Summary info with enhanced layout
      doc.setFontSize(11);
      doc.setTextColor(52, 73, 94);
      doc.setFont('helvetica', 'normal');
      
      // Left side - Total appointments
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(20, 95, 80, 12, 2, 2, 'F');
      doc.setTextColor(107, 142, 35);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Appointments:', 25, 102);
      doc.setTextColor(52, 73, 94);
      doc.setFont('helvetica', 'normal');
      doc.text(`${appointments.length}`, 25, 108);
      
      // Right side - Generation date
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(pageWidth - 100, 95, 80, 12, 2, 2, 'F');
      doc.setTextColor(107, 142, 35);
      doc.setFont('helvetica', 'bold');
      doc.text('Generated:', pageWidth - 95, 102);
      doc.setTextColor(52, 73, 94);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString(), pageWidth - 95, 108);
      
      // Line separator
      doc.setDrawColor(107, 142, 35);
      doc.setLineWidth(1);
      doc.line(20, 115, pageWidth - 20, 115);
      
      // Prepare table data
      const tableData = appointments.map(apt => [
        apt.full_name || 'N/A',
        apt.email || 'N/A',
        apt.phone_no || 'N/A',
        apt.health_concern || 'N/A',
        this.formatDate(apt.preferred_date),
        this.formatTime(apt.preferred_time),
        this.formatStatus(apt.status)
      ]);
      
      // Create enhanced table
      doc.autoTable({
        head: [['Patient Name', 'Email', 'Phone', 'Health Concern', 'Date', 'Time', 'Status']],
        body: tableData,
        startY: 125,
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [107, 142, 35],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 32 },
          2: { cellWidth: 22 },
          3: { cellWidth: 35 },
          4: { cellWidth: 22 },
          5: { cellWidth: 18 },
          6: { cellWidth: 18 }
        },
        margin: { top: 10 }
      });
      
      // Footer
      this.addFooter(doc, pageWidth, pageHeight);
      
      console.log('✅ PDF Service - PDF generation completed successfully');
      return doc;
    } catch (error) {
      console.error('❌ PDF Service - Error in PDF generation:', error);
      throw error;
    }
  }

  // Add header with logo and company info
  addHeader(doc, pageWidth) {
    // Background rectangle for header
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Company logo with gradient effect
    doc.setFillColor(107, 142, 35);
    doc.roundedRect(20, 15, 35, 25, 3, 3, 'F');
    
    // Add logo text inside the rectangle with better styling
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('GOI', 37.5, 30, { align: 'center' });
    
    // Add a small accent line under the logo
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(25, 35, 50, 35);
    
    // Company name with enhanced styling
    doc.setFontSize(18);
    doc.setTextColor(107, 142, 35);
    doc.setFont('helvetica', 'bold');
    doc.text(this.companyName, 65, 25);
    
    // Company tagline
    doc.setFontSize(11);
    doc.setTextColor(52, 73, 94);
    doc.setFont('helvetica', 'italic');
    doc.text(this.companyTagline, 65, 32);
    
    // Contact info in a structured layout
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(108, 117, 125);
    
    // Left column
    doc.text(`📍 ${this.companyAddress}`, 65, 40);
    doc.text(`📧 ${this.companyEmail}`, 65, 45);
    
    // Right column
    doc.text(`📞 ${this.companyPhone}`, 140, 40);
    doc.text(`🌐 ${this.companyWebsite}`, 140, 45);
    
    // Add a decorative line with gradient effect
    doc.setDrawColor(107, 142, 35);
    doc.setLineWidth(2);
    doc.line(20, 55, pageWidth - 20, 55);
    
    // Add subtle shadow effect
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 56, pageWidth - 20, 56);
  }

  // Add enhanced section header
  addEnhancedSectionHeader(doc, title, y) {
    // Background for section header
    doc.setFillColor(107, 142, 35);
    doc.roundedRect(20, y - 8, 170, 12, 2, 2, 'F');
    
    // Section title
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 25, y);
    
    // Add subtle shadow
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, y + 4, 190, y + 4);
  }

  // Add enhanced information table
  addEnhancedInfoTable(doc, data, startY) {
    data.forEach((row, index) => {
      const y = startY + (index * 12);
      
      // Row background (alternating)
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(20, y - 6, 170, 10, 1, 1, 'F');
      }
      
      // Label
      doc.setFontSize(10);
      doc.setTextColor(107, 142, 35);
      doc.setFont('helvetica', 'bold');
      doc.text(row[0] + ':', 25, y);
      
      // Value
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(52, 73, 94);
      const splitText = doc.splitTextToSize(row[1], 120);
      doc.text(splitText, 85, y);
      
      // Add subtle border
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(20, y + 2, 190, y + 2);
    });
  }

  // Add section header (legacy method for compatibility)
  addSectionHeader(doc, title, y) {
    doc.setFontSize(12);
    doc.setTextColor(107, 142, 35);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y);
    
    // Underline
    doc.setDrawColor(107, 142, 35);
    doc.setLineWidth(0.3);
    doc.line(20, y + 2, 80, y + 2);
  }

  // Add information table (legacy method for compatibility)
  addInfoTable(doc, data, startY) {
    data.forEach((row, index) => {
      const y = startY + (index * 8);
      
      // Label
      doc.setFontSize(10);
      doc.setTextColor(52, 73, 94);
      doc.setFont('helvetica', 'bold');
      doc.text(row[0] + ':', 20, y);
      
      // Value
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(row[1], 120);
      doc.text(splitText, 80, y);
    });
  }

  // Add footer with enhanced styling
  addFooter(doc, pageWidth, pageHeight) {
    const footerY = pageHeight - 25;
    
    // Footer background
    doc.setFillColor(248, 249, 250);
    doc.rect(0, footerY - 10, pageWidth, 25, 'F');
    
    // Footer line
    doc.setDrawColor(107, 142, 35);
    doc.setLineWidth(1);
    doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
    
    // Footer content
    doc.setFontSize(8);
    doc.setTextColor(52, 73, 94);
    doc.setFont('helvetica', 'normal');
    
    // Left side - Company info
    doc.text('Gems of Insight - Your Health, Our Priority', 20, footerY - 5);
    doc.text(`${this.companyAddress} | ${this.companyPhone}`, 20, footerY - 1);
    
    // Center - Generation info
    const generatedText = `Generated on ${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`;
    doc.text(generatedText, pageWidth / 2, footerY - 3, { align: 'center' });
    
    // Right side - Page info
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - 20, footerY - 5, { align: 'right' });
    doc.text('Admin System', pageWidth - 20, footerY - 1, { align: 'right' });
    
    // Add a subtle border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(0, footerY - 10, pageWidth, 25);
  }

  // Format date
  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format time
  formatTime(time24h) {
    if (!time24h) return 'N/A';
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  // Format status
  formatStatus(status) {
    const statusMap = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed'
    };
    return statusMap[status] || status || 'N/A';
  }

  // Download PDF
  downloadPDF(doc, filename) {
    doc.save(filename);
  }

  // Generate and download single appointment PDF
  downloadAppointmentPDF(appointment) {
    const doc = this.generateAppointmentPDF(appointment);
    const filename = `appointment_${appointment.full_name?.replace(/\s+/g, '_') || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.downloadPDF(doc, filename);
  }

  // Generate and download appointments list PDF
  downloadAppointmentsListPDF(appointments, title = 'Appointments List') {
    console.log('📄 PDF Service - Starting appointments list PDF generation');
    console.log('📊 Appointments count:', appointments.length);
    console.log('📋 Title:', title);
    
    try {
      const doc = this.generateAppointmentsListPDF(appointments, title);
      const filename = `appointments_${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('📄 Filename:', filename);
      this.downloadPDF(doc, filename);
      console.log('✅ PDF Service - Appointments list PDF generated successfully');
    } catch (error) {
      console.error('❌ PDF Service - Error generating appointments list PDF:', error);
      throw error;
    }
  }

  // Generate and download filtered appointments PDF
  downloadFilteredAppointmentsPDF(appointments, filter = 'all') {
    console.log('📄 PDF Service - Starting filtered appointments PDF generation');
    console.log('📊 Appointments count:', appointments.length);
    console.log('🔍 Filter:', filter);
    
    try {
      const title = `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`;
      const doc = this.generateAppointmentsListPDF(appointments, title);
      const filename = `appointments_${filter}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('📄 Filename:', filename);
      this.downloadPDF(doc, filename);
      console.log('✅ PDF Service - Filtered appointments PDF generated successfully');
    } catch (error) {
      console.error('❌ PDF Service - Error generating filtered appointments PDF:', error);
      throw error;
    }
  }

  // Generate and download today's appointments PDF
  downloadTodayAppointmentsPDF(appointments) {
    console.log('📄 PDF Service - Starting today\'s appointments PDF generation');
    console.log('📊 Appointments count:', appointments.length);
    
    try {
      const doc = this.generateAppointmentsListPDF(appointments, "Today's Appointments");
      const filename = `appointments_today_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('📄 Filename:', filename);
      this.downloadPDF(doc, filename);
      console.log('✅ PDF Service - Today\'s appointments PDF generated successfully');
    } catch (error) {
      console.error('❌ PDF Service - Error generating today\'s appointments PDF:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const pdfService = new PDFService();
export default pdfService;
