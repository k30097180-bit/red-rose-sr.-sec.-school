export function renderRegistrationEmail({ name, email, phone, registrationTime, loginMethod, ipAddress, browser, operatingSystem }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
      <div style="background:#0f172a;padding:20px;border-radius:12px 12px 0 0;color:#fff;">
        <h2 style="margin:0">New User Registration</h2>
      </div>
      <div style="padding:24px;background:#fff;border-radius:0 0 12px 12px;color:#334155;">
        <p>A new student has registered on the school website.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr><td style="padding:8px 0;font-weight:bold">Name</td><td>${name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Email</td><td>${email}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Phone Number</td><td>${phone || 'Not provided'}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Registration Date</td><td>${registrationTime}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Login Method</td><td>${loginMethod}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">IP Address</td><td>${ipAddress || 'Unknown'}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Browser</td><td>${browser || 'Unknown'}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">OS</td><td>${operatingSystem || 'Unknown'}</td></tr>
        </table>
        <p style="margin-top:16px">Regards,<br/>Red Rose School</p>
      </div>
    </div>
  `;
}

export function renderAdmissionEmail({ student }) {
  const rows = [
    ['Student Name', student.studentName],
    ['Father Name', student.fatherName],
    ['Mother Name', student.motherName],
    ['Class Applying For', student.classApplyingFor || student.studentClass || 'N/A'],
    ['Gender', student.gender],
    ['DOB', student.dob],
    ['Phone', student.phone || student.mobile || 'N/A'],
    ['Email', student.email],
    ['Address', student.address],
    ['Previous School', student.previousSchool || 'N/A'],
    ['Message', student.message]
  ];

  const rowsHtml = rows.map(([label, value]) => `<tr><td style="padding:8px 0;font-weight:bold">${label}</td><td>${value || 'N/A'}</td></tr>`).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;background:#fff;border-radius:12px;">
      <h2 style="color:#0f172a">Admission Request Received</h2>
      <p>We have received your admission request. Our team will review it shortly.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rowsHtml}</table>
      <p style="margin-top:16px">Thank you,<br/>Red Rose School</p>
    </div>
  `;
}

export function renderAdminAdmissionEmail({ student }) {
  const rows = [
    ['Student Name', student.studentName],
    ['Father Name', student.fatherName],
    ['Mother Name', student.motherName],
    ['Class Applying For', student.classApplyingFor || student.studentClass || 'N/A'],
    ['Gender', student.gender],
    ['DOB', student.dob],
    ['Phone', student.phone || student.mobile || 'N/A'],
    ['Email', student.email],
    ['Address', student.address],
    ['Previous School', student.previousSchool || 'N/A'],
    ['Message', student.message],
    ['Submitted At', new Date(student.createdAt).toLocaleString()]
  ];

  const rowsHtml = rows.map(([label, value]) => `<tr><td style="padding:8px 0;font-weight:bold">${label}</td><td>${value || 'N/A'}</td></tr>`).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#0f172a">New Admission Request</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rowsHtml}</table>
    </div>
  `;
}

export function renderJobApplicationEmail({ application }) {
  const rows = [
    ['Full Name', application.fullName],
    ['Email', application.email],
    ['Phone', application.phone],
    ['Qualification', application.qualification],
    ['Experience', application.experience],
    ['Subject', application.subject],
    ['Expected Salary', application.expectedSalary],
    ['Current Address', application.currentAddress],
    ['Message', application.message],
    ['Submitted At', new Date(application.createdAt).toLocaleString()],
    ['Applicant IP', application.ipAddress || 'N/A'],
    ['Browser', application.browser || 'N/A'],
    ['Operating System', application.operatingSystem || 'N/A']
  ];

  const rowsHtml = rows.map(([label, value]) => `<tr><td style="padding:8px 0;font-weight:bold">${label}</td><td>${value || 'N/A'}</td></tr>`).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#0f172a">New Teacher Job Application</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rowsHtml}</table>
    </div>
  `;
}

export function renderContactEmail({ contact }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#0f172a">Website Contact Form</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px 0;font-weight:bold">Name</td><td>${contact.name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold">Email</td><td>${contact.email}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold">Phone</td><td>${contact.phone || 'N/A'}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold">Message</td><td>${contact.message}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold">Date</td><td>${new Date(contact.createdAt).toLocaleString()}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold">IP Address</td><td>${contact.ipAddress || 'N/A'}</td></tr>
      </table>
    </div>
  `;
}

export function renderNewsletterEmail({ email }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
      <h2 style="color:#0f172a">New Newsletter Subscriber</h2>
      <p>A new visitor subscribed to the newsletter.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
    </div>
  `;
}
