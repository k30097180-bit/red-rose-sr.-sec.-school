document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('jobApplicationForm');
    const notice = document.getElementById('applyNotice');

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

        const payload = { fullName: name, email, phone, qualification, experience, subject, currentAddress: '', message, expectedSalary: '' };
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

        const resumeInput = document.getElementById('applicantResume');
        if (resumeInput && resumeInput.files && resumeInput.files[0]) {
            formData.append('resume', resumeInput.files[0]);
        }

        try {
            const response = await fetch('/api/apply-job', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Unable to submit application.');
            }

            showNotice('Your application has been submitted successfully. Our HR team will contact you soon.', 'success');
            form.reset();
        } catch (error) {
            console.warn('Job application backend unavailable, using mailto fallback.', error);
            openMailClient(payload);
            showNotice('No backend available in preview. Your email client has been opened to send the application manually.', 'success');
        }
    });

    function openMailClient(payload) {
        const subject = `Job Application: ${encodeURIComponent(payload.fullName)} (${encodeURIComponent(payload.subject)})`;
        const body = [
            `Name: ${payload.fullName}`,
            `Email: ${payload.email}`,
            `Phone: ${payload.phone}`,
            `Subject: ${payload.subject}`,
            `Qualification: ${payload.qualification}`,
            `Experience: ${payload.experience} years`,
            '',
            `Message:\n${payload.message}`
        ].join('\n');

        const mailto = `mailto:shahidbhati8233@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    }

    function showNotice(text, type) {
        if (!notice) return;
        notice.textContent = text;
        notice.style.color = type === 'success' ? '#0f766e' : '#b91c1c';
    }
});
