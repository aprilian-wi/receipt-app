// Pastikan fungsi berikut sudah ada dan benar:
// function convertNumberToWords(number) { ... }
// function formatNumber(number) { ... }
// function formatDate(dateStr) { ... }

function updatePreview() {
    const getValue = id => document.getElementById(id)?.value || '';
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const noKwitansi = getValue('noKwitansi');
    const tanggal = getValue('tanggal');
    const terimaDari = getValue('terimaDari');
    const nominalInput = getValue('nominal');
    const nominalRaw = nominalInput.replace(/\D/g, '');
    const untukPembayaran = getValue('untukPembayaran');
    const penerima = getValue('penerima');

    setText('previewNo', noKwitansi || '-');
    setText('previewTanggal', tanggal ? (typeof formatDate === 'function' ? formatDate(tanggal) : tanggal) : '-');
    setText('previewTerimaDari', terimaDari || '-');

    if (nominalRaw) {
        setText(
            'previewUangSebanyak',
            typeof convertNumberToWords === 'function'
                ? convertNumberToWords(parseInt(nominalRaw, 10))
                : nominalRaw
        );
        setText(
            'previewTerbilang',
            typeof formatNumber === 'function'
                ? formatNumber(nominalRaw)
                : nominalRaw
        );
    } else {
        setText('previewUangSebanyak', '-');
        setText('previewTerbilang', '-');
    }

    setText('previewUntukPembayaran', untukPembayaran || '-');
    setText('previewPenerima', penerima || '-');
}

document.addEventListener('DOMContentLoaded', function() {
    // Update preview for any input, select, or textarea
    document.querySelectorAll('#kwitansiForm input, #kwitansiForm textarea, #kwitansiForm select').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Format nominal input as user types or pastes
    const nominalInput = document.getElementById('nominal');
    if (nominalInput) {
        // On input
        nominalInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                // Hindari double format jika sudah terformat
                const formatted = typeof formatNumber === 'function' ? formatNumber(value) : value;
                // Cegah kursor meloncat ke akhir
                const selectionStart = e.target.selectionStart;
                e.target.value = formatted;
                // Perbaiki posisi kursor jika memungkinkan
                if (selectionStart !== null) {
                    e.target.setSelectionRange(formatted.length, formatted.length);
                }
            } else {
                e.target.value = '';
            }
        });
        // On paste
        nominalInput.addEventListener('paste', function(e) {
            e.preventDefault();
            let text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            if (text) {
                e.target.value = typeof formatNumber === 'function' ? formatNumber(text) : text;
            } else {
                e.target.value = '';
            }
            updatePreview();
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
                alert('html2canvas belum dimuat atau elemen kwitansi tidak ditemukan.');
            }
        });
    }

    // Inisialisasi preview pertama kali
    updatePreview();
});
