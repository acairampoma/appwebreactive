// Exporta el CV a PDF usando html2pdf.js
// Asegúrate de tener html2pdf.js en tu proyecto o usar CDN

export function exportCvToPdf() {
    const btn = document.getElementById('btn-export-pdf');
    const element = document.querySelector('.cv-container');
    if (btn) btn.style.display = 'none';
    if (element) element.classList.add('pdf-export');
    const opt = {
        margin:       0.2,
        filename:     'AlanCairampoma-CV.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
        if (btn) btn.style.display = '';
        if (element) element.classList.remove('pdf-export');
    });
}
