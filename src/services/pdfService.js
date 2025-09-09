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
