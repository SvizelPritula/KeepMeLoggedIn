Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(e => {
    new bootstrap.Tooltip(e);
});