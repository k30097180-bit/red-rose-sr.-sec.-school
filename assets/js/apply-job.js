document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('jobApplicationForm');
    const notice = document.getElementById('applyNotice');
    const resumeInput = document.getElementById('applicantResume');

    const WHATSAPP_NUMBER = "918233809870";

    if (!form) return;

    // Create modal styles dynamically
    createModalStyles();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('applicantName').value.trim();
        const email = document.getElementById('applicantEmail').value.trim();
        const phone = document.getElementById('applicantPhone').value.trim();
        const subject = document.getElementById('applicantSubject').value.trim();
        const qualification = document.getElementById('applicantQualification').value.trim();
        const experience = document.getElementById('applicantExperience').value.trim();
        const message = document.getElementById('applicantMessage').value.trim();

        // Validate all required fields
        if (!name || !email || !phone || !subject || !qualification || !experience || !message) {
            showNotice('Please complete all required fields before submitting.', 'error');
            return;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotice('Please enter a valid email address.', 'error');
            return;
        }

        // Validate phone format
        if (!/^[6-9]\d{9}$/.test(phone)) {
            showNotice('Please enter a valid 10-digit phone number.', 'error');
            return;
        }

        const resumeFile = resumeInput && resumeInput.files && resumeInput.files[0];
        const resumeFileName = resumeFile ? resumeFile.name : null;

        const payload = {
            fullName: name,
            email: email,
            phone: phone,
            subject: subject,
            qualification: qualification,
            experience: experience,
            message: message,
            resumeFileName: resumeFileName
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

            // Save to local storage backup
            saveApplicationBackup(payload);

            // Show resume notice modal
            showResumeNoticeModal(resumeFileName);

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
            `Introduction:\n${payload.message}`
        ];

        // Add resume file name if available
        if (payload.resumeFileName) {
            lines.push("");
            lines.push(`Resume File: ${payload.resumeFileName}`);
        }

        lines.push("");
        return lines.join("\n");
    }

    function showResumeNoticeModal(resumeFileName) {
        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'resumeNoticeModal';
        modal.className = 'resume-notice-modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'resume-notice-modal';
        
        let resumeInfo = '';
        if (resumeFileName) {
            resumeInfo = `<p class="resume-file-info"><strong>Resume Selected:</strong> ${resumeFileName}</p>`;
        }

        modalContent.innerHTML = `
            <div class="resume-notice-header">
                <i class="fas fa-file-pdf"></i>
                <h2>Resume Attachment Required</h2>
            </div>
            
            <div class="resume-notice-body">
                <p>Your application details have been opened in WhatsApp.</p>
                
                <div class="resume-notice-alert">
                    <p><strong>⚠️ Important:</strong> Your resume cannot be attached automatically due to WhatsApp limitations.</p>
                </div>
                
                ${resumeInfo}
                
                <div class="resume-instructions">
                    <h3>Please follow these steps:</h3>
                    <ol>
                        <li>Go to WhatsApp window that just opened</li>
                        <li>Click the attachment button (📎 or ➕)</li>
                        <li>Select "Document" and upload your resume</li>
                        <li>Add any additional message if needed</li>
                        <li>Press "Send" to submit your application</li>
                    </ol>
                </div>
            </div>
            
            <div class="resume-notice-footer">
                <button class="resume-notice-btn" id="closeResumeModal">Understood, I'll attach it manually</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close button handler
        document.getElementById('closeResumeModal').addEventListener('click', function () {
            modal.remove();
        });
        
        // Close on overlay click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape key
        const handleEscape = function(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    function createModalStyles() {
        const styleId = 'resume-notice-modal-styles';
        
        // Check if styles already exist
        if (document.getElementById(styleId)) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            .resume-notice-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-in-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .resume-notice-modal {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease-in-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .resume-notice-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 24px;
                text-align: center;
                border-radius: 12px 12px 0 0;
            }

            .resume-notice-header i {
                font-size: 32px;
                margin-bottom: 12px;
                display: block;
            }

            .resume-notice-header h2 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            }

            .resume-notice-body {
                padding: 24px;
            }

            .resume-notice-body p {
                margin: 0 0 16px 0;
                color: #333;
                line-height: 1.6;
                font-size: 15px;
            }

            .resume-notice-alert {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 16px;
                border-radius: 4px;
                margin: 16px 0;
            }

            .resume-notice-alert p {
                margin: 0;
                color: #856404;
                font-size: 14px;
            }

            .resume-file-info {
                background-color: #e8f5e9;
                border-left: 4px solid #4caf50;
                padding: 12px;
                border-radius: 4px;
                margin: 16px 0 !important;
                color: #2e7d32 !important;
                font-size: 14px !important;
            }

            .resume-instructions {
                background-color: #f5f5f5;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
            }

            .resume-instructions h3 {
                margin: 0 0 12px 0;
                font-size: 15px;
                font-weight: 600;
                color: #333;
            }

            .resume-instructions ol {
                margin: 0;
                padding-left: 20px;
                color: #555;
                font-size: 14px;
                line-height: 1.8;
            }

            .resume-instructions li {
                margin-bottom: 8px;
            }

            .resume-notice-footer {
                padding: 16px 24px;
                border-top: 1px solid #eee;
                text-align: center;
                background-color: #f9f9f9;
                border-radius: 0 0 12px 12px;
            }

            .resume-notice-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 6px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .resume-notice-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
            }

            .resume-notice-btn:active {
                transform: translateY(0);
            }

            /* Responsive design */
            @media (max-width: 600px) {
                .resume-notice-modal {
                    width: 95%;
                    max-height: 95vh;
                }

                .resume-notice-header {
                    padding: 20px;
                }

                .resume-notice-header h2 {
                    font-size: 18px;
                }

                .resume-notice-body {
                    padding: 20px;
                }

                .resume-notice-body p {
                    font-size: 14px;
                }

                .resume-instructions ol {
                    font-size: 13px;
                }

                .resume-notice-btn {
                    padding: 10px 24px;
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(styles);
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
