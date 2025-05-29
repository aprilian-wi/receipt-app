// ... function convertNumberToWords, formatNumber, formatDate tetap sama

function updatePreview() {
    const getValue = id => document.getElementById(id)?.value || '';
    const setText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
    
    const noKwitansi = getValue('noKwitansi');
    const tanggal = getValue('tanggal');
    const terimaDari = getValue('terimaDari');
    const nominalRaw = getValue('nominal').replace(/\D/g, '');
    const untukPembayaran = getValue('untukPembayaran');
    const penerima = getValue('penerima');
    
    setText('previewNo', noKwitansi || '-');
    setText('previewTanggal', tanggal ? formatDate(tanggal) : '-');
    setText('previewTerimaDari', terimaDari || '-');
    if (nominalRaw) {
        setText('previewUangSebanyak', convertNumberToWords(parseInt(nominalRaw)));
        setText('previewTerbilang', formatNumber(nominalRaw));
    } else {
        setText('previewUangSebanyak', '-');
        setText('previewTerbilang', '-');
    }
    setText('previewUntukPembayaran', untukPembayaran || '-');
    setText('previewPenerima', penerima || '');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#kwitansiForm input').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Format nominal input
    const nominalInput = document.getElementById('nominal');
    if (nominalInput) {
        nominalInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value ? formatNumber(value) : '';
        });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const receipt = document.getElementById('receiptPreview');
            const noKwitansi = document.getElementById('noKwitansi')?.value.trim() || '';
            const filename = noKwitansi ? noKwitansi.replace(/[\/\\?%*:|"<> ]/g, '_') + '.png' : 'kwitansi.png';
            if (window.html2canvas && receipt) {
                html2canvas(receipt).then(canvas => {
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = canvas.toDataURL();
                    link.click();
                }).catch(error => {
                    console.error('Error generating receipt:', error);
                    alert('Terjadi kesalahan saat mengunduh kwitansi. Silakan coba lagi.');
                });
            } else {
                alert('html2canvas belum dimuat atau elemen receipt tidak ditemukan.');
            }
        });
    }

    // Inisialisasi preview pertama kali
    updatePreview();
});
