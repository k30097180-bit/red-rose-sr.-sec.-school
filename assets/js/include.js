/* ==========================================
        OPTIONAL HTML INCLUDES
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    includeHtml("header", "header.html");
    includeHtml("footer", "footer.html");
});

function includeHtml(targetId, filePath) {
    const target = document.getElementById(targetId);

    if (!target || !filePath || typeof fetch !== "function") {
        return;
    }

    fetch(filePath)
        .then((response) => {
            if (!response.ok) {
                return "";
            }

            return response.text();
        })
        .then((html) => {
            if (html && target) {
                target.innerHTML = html;
            }
        })
        .catch(() => {
            // Includes are optional; pages with inline header/footer should keep working.
        });
}
