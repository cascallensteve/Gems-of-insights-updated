import jsPDF from 'jspdf';

class ReceiptService {
  constructor() {
    this.doc = new jsPDF();
  }

  // Generate a modern, polished receipt PDF
  generateReceiptPDF(order) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    let y = 16;

    // Theme
    const primary = { r: 20, g: 83, b: 45 }; // dark green
    const gray = { r: 100, g: 116, b: 139 }; // slate-500
    const light = { r: 241, g: 245, b: 249 }; // slate-100

    // Brand bar
    doc.setFillColor(primary.r, primary.g, primary.b);
    doc.rect(0, 0, pageWidth, 10, 'F');

    // Header left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Gems of Insight', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.setFontSize(10);
    doc.text('Natural Health & Wellness Store', margin, y + 6);
    doc.text('Email: info@gemsofinsight.com  |  Phone: +254 712 345 678', margin, y + 12);

    // Header right (order meta)
    const rightX = pageWidth - margin;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('ORDER RECEIPT', rightX, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const orderIdText = `Order #${order?.id || order?.orderId || 'N/A'}`;
    const createdText = `Created: ${this.formatDate(order?.created_at || order?.date || new Date())}`;
    const printedText = `Printed: ${this.formatDate(new Date())}`;
    doc.text(orderIdText, rightX, y + 6, { align: 'right' });
    doc.text(createdText, rightX, y + 12, { align: 'right' });
    doc.text(printedText, rightX, y + 18, { align: 'right' });

    y += 28;

    // Summary and shipping row
    doc.setDrawColor(light.r, light.g, light.b);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2, 2, 'S');

    // Status / Payment left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Status:', margin + 4, y + 8);
    doc.text('Payment Method:', margin + 4, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(String(order?.status || 'Pending'), margin + 30, y + 8);
    doc.text(String(order?.payment_method || order?.paymentMethod || 'M-Pesa'), margin + 40, y + 16);

    // Shipping right
    const shipX = margin + 110;
    const shipping = order?.shipping || order?.shipping_info || {};
    doc.setFont('helvetica', 'bold');
    doc.text('Ship To:', shipX, y + 8);
    doc.setFont('helvetica', 'normal');
    const shipLines = [
      `${(shipping.first_name || shipping.firstName || '')} ${(shipping.last_name || shipping.lastName || '')}`.trim() || '—',
      `${shipping.phone || '—'}  ${shipping.email || ''}`.trim(),
      [shipping.address, shipping.city, shipping.county, shipping.postal_code || shipping.postalCode]
        .filter(Boolean).join(', ') || '—'
    ];
    doc.text(shipLines[0], shipX + 22, y + 8);
    doc.text(shipLines[1], shipX + 22, y + 14);
    doc.text(shipLines[2], shipX + 22, y + 20);

    y += 34;

    // Items header
    doc.setFillColor(light.r, light.g, light.b);
    doc.rect(margin, y, pageWidth - margin * 2, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Item', margin + 2, y + 6);
    doc.text('Qty', margin + 100, y + 6);
    doc.text('Price', margin + 120, y + 6);
    doc.text('Total', margin + 160, y + 6);

    y += 12;

    // Items rows
    const items = Array.isArray(order?.items) ? order.items : [];
    let subtotal = 0;
    items.forEach((item, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 16;
      }
      const rowHeight = 8;
      doc.setFillColor(idx % 2 === 0 ? 255 : 250, 255, 255);
      doc.rect(margin, y - 5, pageWidth - margin * 2, rowHeight, 'F');

      const itemNameRaw = item?.name || item?.product_name || item?.title || item?.item_name || item?.productTitle || `Item ${idx + 1}`;
      const itemName = String(itemNameRaw);
      const qty = Number(item?.quantity || 1);
      const price = Number(item?.price || item?.unit_price || 0);
      const lineTotal = qty * price;
      subtotal += lineTotal;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const nameMaxWidth = 90;
      const nameLines = doc.splitTextToSize(itemName, nameMaxWidth);
      doc.text(nameLines, margin + 2, y);
      doc.text(String(qty), margin + 100, y);
      doc.text(`KSH ${price.toLocaleString()}`, margin + 120, y);
      doc.text(`KSH ${lineTotal.toLocaleString()}`, margin + 160, y);
      y += Math.max(rowHeight, nameLines.length * 5);
    });

    y += 6;

    // Totals box
    const totalsX = margin + 110;
    const boxWidth = pageWidth - totalsX - margin;
    const boxHeight = 26;
    doc.setDrawColor(light.r, light.g, light.b);
    doc.roundedRect(totalsX, y, boxWidth, boxHeight, 2, 2, 'S');
    const shippingCost = Number(order?.shippingCost || order?.shipping_cost || 0);
    const tax = Number(order?.tax || 0);
    const total = Number(order?.total || order?.total_amount || subtotal + shippingCost + tax);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', totalsX + 4, y + 8);
    doc.text('Shipping:', totalsX + 4, y + 15);
    doc.text('TOTAL:', totalsX + 4, y + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(`KSH ${subtotal.toLocaleString()}`, totalsX + boxWidth - 4, y + 8, { align: 'right' });
    doc.text(`KSH ${shippingCost.toLocaleString()}`, totalsX + boxWidth - 4, y + 15, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`KSH ${total.toLocaleString()}`, totalsX + boxWidth - 4, y + 22, { align: 'right' });

    y += boxHeight + 14;

    // Footer
    doc.setDrawColor(light.r, light.g, light.b);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.text('Thank you for choosing Gems of Insight.', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.text('For support: info@gemsofinsight.com • Nairobi, Kenya', pageWidth / 2, y, { align: 'center' });

    return doc;
  }

  // Download receipt PDF
  downloadReceiptPDF(order) {
    try {
      const doc = this.generateReceiptPDF(order);
      const filename = `receipt_${order?.id || order?.orderId || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating receipt PDF:', error);
      return false;
    }
  }

  // Download receipt from API
  async downloadReceiptFromAPI(orderId) {
    try {
      const response = await fetch(`/api/orders/receipt/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to download receipt from server');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${orderId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (error) {
      console.error('Error downloading receipt from API:', error);
      return false;
    }
  }

  // Smart download with API-first then fallback
  async downloadReceipt(order) {
    try {
      if (order?.id || order?.orderId) {
        const ok = await this.downloadReceiptFromAPI(order.id || order.orderId);
        if (ok) return true;
      }
      return this.downloadReceiptPDF(order);
    } catch (error) {
      console.error('Error in smart download:', error);
      return this.downloadReceiptPDF(order);
    }
  }

  // Pretty date formatter
  formatDate(dateValue) {
    try {
      const d = new Date(dateValue);
      return d.toLocaleString('en-KE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (_e) {
      return String(dateValue || '');
    }
  }

  // Print receipt (open in new tab and trigger print)
  printReceipt(order) {
    try {
      const doc = this.generateReceiptPDF(order);
      const dataUri = doc.output('datauristring');
      const w = window.open(dataUri, '_blank');
      if (w) {
        w.onload = () => w.print();
      }
      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }
}

const receiptService = new ReceiptService();
export default receiptService;

