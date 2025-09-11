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
    doc.rect(0, 0, pageWidth, 14, 'F');

    // Header left with bigger brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('Gems of Insight', margin, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.setFontSize(11);
    doc.text('Natural Health & Wellness Store', margin, y + 8);
    doc.text('Email: info@gemsofinsight.com  |  Phone: +254 712 345 678', margin, y + 14);

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

    y += 32;

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
      const rowHeight = 14;
      doc.setFillColor(idx % 2 === 0 ? 255 : 250, 255, 255);
      doc.rect(margin, y - 8, pageWidth - margin * 2, rowHeight, 'F');

      const itemNameRaw = item?.name || item?.product_name || item?.title || item?.item_name || item?.productTitle || `Item ${idx + 1}`;
      const itemName = String(itemNameRaw);
      const qty = Number(item?.quantity || 1);
      const price = Number(item?.price || item?.unit_price || 0);
      const lineTotal = qty * price;
      subtotal += lineTotal;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const nameMaxWidth = 84;
      const nameLines = doc.splitTextToSize(itemName, nameMaxWidth);
      // Reserve 12x12 box for image thumbnail (draw placeholder if image missing in sync version)
      doc.setDrawColor(230, 230, 230);
      doc.rect(margin + 2, y - 6, 12, 12);
      doc.setFontSize(9);
      doc.setTextColor(gray.r, gray.g, gray.b);
      doc.text('img', margin + 5.5, y + 0.5, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(nameLines, margin + 16, y);
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

  // Load image URL to data URL
  async loadImageData(url) {
    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (_e) {
      return null;
    }
  }

  // Enhanced receipt with embedded images and bigger logo
  async generateReceiptPDFWithImages(order) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    let y = 16;

    const primary = { r: 20, g: 83, b: 45 };
    const gray = { r: 100, g: 116, b: 139 };
    const light = { r: 241, g: 245, b: 249 };

    // Brand bar
    doc.setFillColor(primary.r, primary.g, primary.b);
    doc.rect(0, 0, pageWidth, 18, 'F');

    // Try to embed brand logo (bigger)
    try {
      const logoData = await this.loadImageData('/images/LOGOGEMS.png');
      if (logoData) {
        doc.addImage(logoData, 'PNG', margin, y - 2, 28, 12);
      }
    } catch (_) {}

    // Brand text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('Gems of Insight', margin + 32, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.setFontSize(11);
    doc.text('Natural Health & Wellness Store', margin + 32, y + 8);
    doc.text('Email: info@gemsofinsight.com  |  Phone: +254 712 345 678', margin + 32, y + 14);

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

    y += 34;

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

    const items = Array.isArray(order?.items) ? order.items : [];
    let subtotal = 0;

    // Preload up to 5 item images to limit memory/time
    const preload = await Promise.all(items.slice(0, 5).map(async (it) => ({
      id: it.id,
      data: it.image ? await this.loadImageData(it.image) : null
    })));

    items.forEach((item, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 16;
      }
      const rowHeight = 16;
      doc.setFillColor(idx % 2 === 0 ? 255 : 250, 255, 255);
      doc.rect(margin, y - 9, pageWidth - margin * 2, rowHeight, 'F');

      const itemNameRaw = item?.name || item?.product_name || item?.title || item?.item_name || item?.productTitle || `Item ${idx + 1}`;
      const itemName = String(itemNameRaw);
      const qty = Number(item?.quantity || 1);
      const price = Number(item?.price || item?.unit_price || 0);
      const lineTotal = qty * price;
      subtotal += lineTotal;

      // Thumbnail if preloaded
      const pre = preload.find(p => p.id === item.id);
      if (pre && pre.data) {
        try { doc.addImage(pre.data, 'JPEG', margin + 2, y - 7, 12, 12); } catch(_) {}
      } else {
        doc.setDrawColor(230, 230, 230);
        doc.rect(margin + 2, y - 7, 12, 12);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const nameMaxWidth = 84;
      const nameLines = doc.splitTextToSize(itemName, nameMaxWidth);
      doc.text(nameLines, margin + 16, y);
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

  // Generate a simple, clean Cart Details PDF for unpaid orders
  generateCartDetailsPDF(orderOrCart) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    let y = 16;

    const primary = { r: 20, g: 83, b: 45 };
    const gray = { r: 100, g: 116, b: 139 };
    const light = { r: 241, g: 245, b: 249 };

    // Header
    doc.setFillColor(primary.r, primary.g, primary.b);
    doc.rect(0, 0, pageWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Gems of Insight', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.setFontSize(10);
    doc.text('Cart Details (Unpaid)', margin, y + 6);
    const rightX = pageWidth - margin;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const idText = `Ref: ${orderOrCart?.id || orderOrCart?.orderId || 'N/A'}`;
    doc.text(idText, rightX, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.text(`Generated: ${this.formatDate(new Date())}`, rightX, y + 6, { align: 'right' });
    y += 18;

    // Info box
    doc.setDrawColor(light.r, light.g, light.b);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Payment Status:', margin + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Not Paid', margin + 40, y + 6);
    y += 24;

    // Table header
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

    const items = Array.isArray(orderOrCart?.items) ? orderOrCart.items : (Array.isArray(orderOrCart) ? orderOrCart : []);
    let subtotal = 0;
    items.forEach((item, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 16;
      }
      const rowHeight = 8;
      doc.setFillColor(idx % 2 === 0 ? 255 : 250, 255, 255);
      doc.rect(margin, y - 5, pageWidth - margin * 2, rowHeight, 'F');

      const name = String(item?.name || item?.product_name || item?.title || `Item ${idx + 1}`);
      const qty = Number(item?.quantity || 1);
      const price = Number(item?.price || item?.unit_price || 0);
      const lineTotal = qty * price;
      subtotal += lineTotal;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const nameMaxWidth = 90;
      const nameLines = doc.splitTextToSize(name, nameMaxWidth);
      doc.text(nameLines, margin + 2, y);
      doc.text(String(qty), margin + 100, y);
      doc.text(`KSH ${price.toLocaleString()}`, margin + 120, y);
      doc.text(`KSH ${lineTotal.toLocaleString()}`, margin + 160, y);
      y += Math.max(rowHeight, nameLines.length * 5);
    });

    y += 6;

    // Totals
    const totalsX = margin + 110;
    const boxWidth = pageWidth - totalsX - margin;
    const boxHeight = 20;
    doc.setDrawColor(light.r, light.g, light.b);
    doc.roundedRect(totalsX, y, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', totalsX + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(`KSH ${subtotal.toLocaleString()}`, totalsX + boxWidth - 4, y + 7, { align: 'right' });

    y += boxHeight + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(gray.r, gray.g, gray.b);
    doc.text('This is not a receipt. Complete payment to receive an official receipt.', pageWidth / 2, y, { align: 'center' });

    return doc;
  }

  // Download Cart Details PDF
  downloadCartDetailsPDF(orderOrCart) {
    try {
      const doc = this.generateCartDetailsPDF(orderOrCart);
      const filename = `cart_details_${orderOrCart?.id || 'current'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating cart details PDF:', error);
      return false;
    }
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

  // Download enhanced receipt with images
  async downloadReceiptPDFWithImages(order) {
    try {
      const doc = await this.generateReceiptPDFWithImages(order);
      const filename = `receipt_${order?.id || order?.orderId || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      return true;
    } catch (error) {
      console.error('Error generating enhanced receipt PDF:', error);
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
      // Try enhanced version with images first, fallback to basic
      const rich = await this.downloadReceiptPDFWithImages(order);
      if (rich) return true;
      return this.downloadReceiptPDF(order);
    } catch (error) {
      console.error('Error in smart download:', error);
      try {
        const rich = await this.downloadReceiptPDFWithImages(order);
        if (rich) return true;
      } catch (_) {}
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
      const html = this.buildPrintableHtml(order);
      const w = window.open('', '_blank');
      if (!w) return false;
      w.document.open();
      w.document.write(html);
      w.document.close();
      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  buildPrintableHtml(order) {
    const items = Array.isArray(order?.items) ? order.items : (order?.cart || []);
    const rows = items.map((item, idx) => {
      const name = String(item?.name || item?.product_name || item?.title || `Item ${idx + 1}`);
      const qty = Number(item?.quantity || 1);
      const price = Number(item?.price || item?.unit_price || 0);
      const lineTotal = qty * price;
      return `<tr class="border-b border-gray-100">
        <td class="px-3 py-2 text-sm">${name}</td>
        <td class="px-3 py-2 text-sm">${qty}</td>
        <td class="px-3 py-2 text-sm">KSH ${price.toLocaleString()}</td>
        <td class="px-3 py-2 text-sm">KSH ${lineTotal.toLocaleString()}</td>
      </tr>`;
    }).join('');

    const shippingCost = Number(order?.shippingCost || order?.shipping_cost || 0);
    const tax = Number(order?.tax || 0);
    const subtotal = items.reduce((s, it) => s + Number(it?.quantity || 1) * Number(it?.price || it?.unit_price || 0), 0);
    const total = Number(order?.total || order?.total_amount || subtotal + shippingCost + tax);

    const body = `
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">Gems of Insight</h1>
          <div class="text-sm text-gray-600">Order Receipt</div>
        </div>
        <div class="text-right text-sm text-gray-600">
          <div>Order #${order?.id || order?.orderId || 'N/A'}</div>
          <div>Created: ${new Date(order?.created_at || order?.date || Date.now()).toLocaleString()}</div>
          <div>Printed: ${new Date().toLocaleString()}</div>
        </div>
      </div>
      <div class="rounded-xl border border-emerald-100 bg-white p-4">
        <h2 class="mb-3 text-base font-semibold text-emerald-700">Items</h2>
        <table class="w-full table-auto border-collapse overflow-hidden rounded-md border border-gray-100">
          <thead class="bg-emerald-50 text-emerald-800">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-semibold">Item</th>
              <th class="px-3 py-2 text-left text-xs font-semibold">Qty</th>
              <th class="px-3 py-2 text-left text-xs font-semibold">Price</th>
              <th class="px-3 py-2 text-left text-xs font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="mt-4 grid gap-1 text-sm">
          <div class="flex items-center justify-between"><span class="text-gray-600">Subtotal</span><span class="font-medium">KSH ${subtotal.toLocaleString()}</span></div>
          <div class="flex items-center justify-between"><span class="text-gray-600">Shipping</span><span class="font-medium">KSH ${shippingCost.toLocaleString()}</span></div>
          ${tax ? `<div class=\"flex items-center justify-between\"><span class=\"text-gray-600\">Tax</span><span class=\"font-medium\">KSH ${tax.toLocaleString()}</span></div>` : ''}
          <div class="mt-2 flex items-center justify-between border-t border-gray-100 pt-2"><span class="text-gray-800">TOTAL</span><span class="text-base font-semibold">KSH ${total.toLocaleString()}</span></div>
        </div>
      </div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Receipt</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>@media print { .no-print{ display:none!important } }</style>
  </head>
  <body class="bg-white text-gray-900">
    <div class="mx-auto max-w-3xl p-6">${body}
      <div class="mt-6 border-t border-emerald-100 pt-3 text-center text-xs text-gray-500">© ${new Date().getFullYear()} Gems of Insight. All rights reserved.</div>
    </div>
    <script>window.onload=()=>{ setTimeout(()=>window.print(),150); };</script>
  </body>
</html>`;
  }
}

const receiptService = new ReceiptService();
export default receiptService;

