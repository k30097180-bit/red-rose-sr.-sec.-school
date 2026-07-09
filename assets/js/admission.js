/* ==========================================
        ADMISSION FORM
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const steps = Array.from(document.querySelectorAll(".step"));
    const formSteps = Array.from(document.querySelectorAll(".form-step"));
    const admissionSection = document.querySelector(".admission-form-section");
    const studentClass = document.getElementById("studentClass");
    const streamBox = document.getElementById("stream-box");
    const submitBtn = document.querySelector(".submit-btn");

    if (!formSteps.length) {
        return;
    }

    let currentStep = Math.max(0, formSteps.findIndex((step) => step.classList.contains("active")));

    if (currentStep === -1) {
        currentStep = 0;
    }

    updateSteps(false);
    updateStreamBox();

    document.addEventListener("click", (e) => {
        const target = e.target instanceof Element ? e.target : null;
        const nextBtn = target ? target.closest(".next-btn") : null;
        const prevBtn = target ? target.closest(".prev-btn") : null;

        if (nextBtn) {
            e.preventDefault();

            if (currentStep === 1) {
                fillReview();
            }

            goToStep(currentStep + 1);
        }

        if (prevBtn) {
            e.preventDefault();
            goToStep(currentStep - 1);
        }
    });

    if (studentClass) {
        studentClass.addEventListener("change", updateStreamBox);
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            fillReview();

            const payload = getAdmissionPayload();
            const validationError = validateAdmissionPayload(payload);

            if (validationError) {
                showMessage(validationError, "error");
                return;
            }

            await submitAdmission(payload);
        });
    }

    function goToStep(index) {
        if (index < 0 || index >= formSteps.length) {
            return;
        }

        currentStep = index;
        updateSteps(true);
    }

    function updateSteps(shouldScroll) {
        formSteps.forEach((step) => {
            if (step) {
                step.classList.remove("active");
            }
        });

        const activeFormStep = formSteps[currentStep];

        if (activeFormStep) {
            activeFormStep.classList.add("active");
        }

        steps.forEach((step) => {
            if (step) {
                step.classList.remove("active");
            }
        });

        const activeProgressIndex = Math.min(currentStep, steps.length - 1);
        const activeProgressStep = steps[activeProgressIndex];

        if (activeProgressStep) {
            activeProgressStep.classList.add("active");
        }

        if (shouldScroll && admissionSection) {
            window.scrollTo({
                top: admissionSection.offsetTop - 80,
                behavior: "smooth"
            });
        }
    }

    function updateStreamBox() {
        if (!studentClass || !streamBox) {
            return;
        }

        const showStream = studentClass.value === "Class 11" || studentClass.value === "Class 12";
        streamBox.style.display = showStream ? "block" : "none";
    }

    function getFieldValue(id) {
        const el = document.getElementById(id);

        if (!el || typeof el.value === "undefined") {
            return "-";
        }

        const value = el.value.trim();
        return value || "-";
    }

    function getStreamValue() {
        if (!studentClass) {
            return "-";
        }

        const needsStream = studentClass.value === "Class 11" || studentClass.value === "Class 12";

        if (!needsStream) {
            return "-";
        }

        return getFieldValue("stream");
    }

    function fillReview() {
        setReviewValue("reviewStudentName", getFieldValue("studentName"));
        setReviewValue("reviewDOB", getFieldValue("dob"));
        setReviewValue("reviewGender", getFieldValue("gender"));
        setReviewValue("reviewClass", getFieldValue("studentClass"));
        setReviewValue("reviewStream", getStreamValue());
        setReviewValue("reviewFather", getFieldValue("fatherName"));
        setReviewValue("reviewMother", getFieldValue("motherName"));
        setReviewValue("reviewMobile", getFieldValue("mobile"));
        setReviewValue("reviewEmail", getFieldValue("email"));
        setReviewValue("reviewAddress", getFieldValue("address"));
    }

    function setReviewValue(id, value) {
        const el = document.getElementById(id);

        if (el) {
            el.textContent = value || "-";
        }
    }

    function getAdmissionPayload() {
        return {
            studentName: getFieldValue("studentName"),
            dob: getFieldValue("dob"),
            gender: getFieldValue("gender"),
            category: getFieldValue("category"),
            studentClass: getFieldValue("studentClass"),
            stream: getStreamValue(),
            fatherName: getFieldValue("fatherName"),
            motherName: getFieldValue("motherName"),
            mobile: getFieldValue("mobile"),
            whatsapp: getFieldValue("whatsapp"),
            email: getFieldValue("email"),
            occupation: getFieldValue("occupation"),
            address: getFieldValue("address"),
            city: getFieldValue("city"),
            state: getFieldValue("state"),
            pincode: getFieldValue("pincode")
        };
    }

    function validateAdmissionPayload(data) {
        const requiredFields = [
            ["studentName", "Student name is required."],
            ["dob", "Date of birth is required."],
            ["gender", "Gender is required."],
            ["studentClass", "Class is required."],
            ["fatherName", "Father's name is required."],
            ["motherName", "Mother's name is required."],
            ["mobile", "Mobile number is required."],
            ["address", "Full address is required."]
        ];

        for (const [key, message] of requiredFields) {
            if (!data[key] || data[key] === "-") {
                return message;
            }
        }

        if (!/^[6-9]\d{9}$/.test(data.mobile)) {
            return "Please enter a valid 10 digit mobile number.";
        }

        if (data.whatsapp !== "-" && !/^[6-9]\d{9}$/.test(data.whatsapp)) {
            return "Please enter a valid 10 digit WhatsApp number.";
        }

        if (data.email !== "-" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return "Please enter a valid email address.";
        }

        return "";
    }

    const EMAIL_SETTINGS = {
        enabled: false,
        serviceId: "",
        templateId: "",
        publicKey: "",
        toEmail: "sahidbhati8233@gmail.com"
    };

    async function submitAdmission(payload) {
        if (!submitBtn) {
            return;
        }

        const originalHtml = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";
        showMessage("", "");

        try {
            saveSubmissionBackup(payload);

            const response = await fetch('/api/admissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || 'Unable to send admission form. Please try again.');
            }

            showMessage('Admission submitted successfully.', 'success');
            const successIndex = formSteps.findIndex((step) => step.id === 'success-page');

            setTimeout(() => {
                if (successIndex >= 0) {
                    goToStep(successIndex);
                }
            }, 2000);
        } catch (error) {
            console.error('Admission submit failed:', error);
            showMessage(error.message || 'Unable to send admission form. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
        }
    }

    function buildEmailBody(payload) {
        return [
            "Student Information:",
            `- Name: ${payload.studentName}`,
            `- DOB: ${payload.dob}`,
            `- Gender: ${payload.gender}`,
            `- Class: ${payload.studentClass}`,
            `- Stream: ${payload.stream}`,
            "", 
            "Parent Information:",
            `- Father Name: ${payload.fatherName}`,
            `- Mother Name: ${payload.motherName}`,
            `- Mobile: ${payload.mobile}`,
            `- WhatsApp: ${payload.whatsapp}`,
            `- Email: ${payload.email}`,
            `- Address: ${payload.address}`,
            `- City: ${payload.city}`,
            `- State: ${payload.state}`,
            `- PIN: ${payload.pincode}`
        ].join("\n");
    }

    function sendAdmissionByMailto(payload) {
        try {
            const subject = "New Admission Request - Red Rose School";
            const body = encodeURIComponent(buildEmailBody(payload));
            const mailtoLink = `mailto:${EMAIL_SETTINGS.toEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
            const anchor = document.createElement("a");
            anchor.href = mailtoLink;
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            return true;
        } catch (mailtoError) {
            console.error("Mailto send failed:", mailtoError);
            return false;
        }
    }

    function saveSubmissionBackup(payload) {
        try {
            const saved = localStorage.getItem("rr_admission_requests");
            const requests = saved ? JSON.parse(saved) : [];
            const entry = {
                ...payload,
                submittedAt: new Date().toISOString()
            };

            requests.push(entry);
            localStorage.setItem("rr_admission_requests", JSON.stringify(requests));
        } catch (storageError) {
            console.error("Admission backup save failed:", storageError);
        }
    }

    function loadEmailJSSDK() {
        if (window.emailjs) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load EmailJS SDK."));
            document.head.appendChild(script);
        });
    }

    function showMessage(message, type) {
        if (!submitBtn) {
            return;
        }

        let messageBox = document.getElementById("admissionMessage");

        if (!messageBox && submitBtn.parentElement) {
            messageBox = document.createElement("p");
            messageBox.id = "admissionMessage";
            messageBox.style.width = "100%";
            messageBox.style.marginTop = "16px";
            messageBox.style.fontWeight = "600";
            messageBox.style.textAlign = "center";
            submitBtn.parentElement.appendChild(messageBox);
        }

        if (!messageBox) {
            if (message) {
                alert(message);
            }

            return;
        }

        messageBox.textContent = message;
        messageBox.style.display = message ? "block" : "none";
        messageBox.style.color = type === "success" ? "#16A34A" : "#D32F2F";
    }
});
