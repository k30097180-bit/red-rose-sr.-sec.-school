document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const WHATSAPP_NUMBER = "918233809870";

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const whatsappMessage = buildWhatsAppMessage({ name, email, phone, message });
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Open WhatsApp in new window
      const whatsappWindow = window.open(whatsappUrl, "_blank");
      
      if (!whatsappWindow) {
        throw new Error("Unable to open WhatsApp. Please check your browser popup settings.");
      }

      alert('Your message details have been opened in WhatsApp. Please press Send to submit.');
      
      // Save to local storage backup
      saveContactBackup({ name, email, phone, message });
      
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      alert(error.message || 'Unable to open WhatsApp. Please try again.');
    }
  });

  function buildWhatsAppMessage(data) {
    const lines = [
      "📧 CONTACT REQUEST",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || 'Not provided'}`,
      "",
      `Message:\n${data.message}`,
      ""
    ];
    return lines.join("\n");
  }

  function saveContactBackup(data) {
    try {
      const saved = localStorage.getItem("rr_contact_messages");
      const messages = saved ? JSON.parse(saved) : [];
      const entry = {
        ...data,
        submittedAt: new Date().toISOString()
      };

      messages.push(entry);
      localStorage.setItem("rr_contact_messages", JSON.stringify(messages));
    } catch (storageError) {
      console.error("Contact backup save failed:", storageError);
    }
  }
});
