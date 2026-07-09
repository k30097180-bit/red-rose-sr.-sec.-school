document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('jobApplicationForm');
    const notice = document.getElementById('applyNotice');

    const WHATSAPP_NUMBER = "918233809870";

    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('applicantName').value.trim();
        const email = document.getElementById('applicantEmail').value.trim();
        const phone = document.getElementById('applicantPhone').value.trim();
        const subject = document.getElementById('applicantSubject').value.trim();
        const qualification = document.getElementById('applicantQualification').value.trim();
        const experience = document.getElementById('applicantExperience').value.trim();
        const message = document.getElementById('applicantMessage').value.trim();

        if (!name || !email || !phone || !subject || !qualification || !experience || !message) {
            showNotice('Please complete all required fields before submitting.', 'error');
            return;
        }

        const payload = {
            fullName: name,
            email: email,
            phone: phone,
            subject: subject,
            qualification: qualification,
            experience: experience,
            message: message
        };

        try {
            const whatsappMessage = buildWhatsAppMessage(payload);
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            // Open WhatsApp in new window
            const whatsappWindow = window.open(whatsappUrl, "_blank");
            
            if (!whatsappWindow) {
                throw new Error("Unable to open WhatsApp. Please check your browser popup settings.");
            }

            showNotice('Your application details have been opened in WhatsApp. Please press Send to submit.', 'success');
            
            // Save to local storage backup
            saveApplicationBackup(payload);
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
            }, 1000);
        } catch (error) {
            console.error('Job application error:', error);
            showNotice(error.message || 'Unable to open WhatsApp. Please try again.', 'error');
        }
    });

    function buildWhatsAppMessage(payload) {
        const lines = [
            "💼 JOB APPLICATION",
            "",
            `Applicant Name: ${payload.fullName}`,
            `Mobile: ${payload.phone}`,
            `Email: ${payload.email}`,
            `Subject Specialization: ${payload.subject}`,
            `Qualification: ${payload.qualification}`,
            `Years of Experience: ${payload.experience}`,
            "",
            `Introduction:\n${payload.message}`,
            ""
        ];
        return lines.join("\n");
    }

    function saveApplicationBackup(payload) {
        try {
            const saved = localStorage.getItem("rr_job_applications");
            const applications = saved ? JSON.parse(saved) : [];
            const entry = {
                ...payload,
                submittedAt: new Date().toISOString()
            };

            applications.push(entry);
            localStorage.setItem("rr_job_applications", JSON.stringify(applications));
        } catch (storageError) {
            console.error("Application backup save failed:", storageError);
        }
    }

    function showNotice(text, type) {
        if (!notice) return;
        notice.textContent = text;
        notice.style.color = type === 'success' ? '#0f766e' : '#b91c1c';
    }
});
