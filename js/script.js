// Fungsi utility

function formatNumber(number) {
    number = (typeof number === 'string' ? number.replace(/\D/g, '') : number).toString();
    if (!number) return '0';
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function convertNumberToWords(number) {
    const toWords = (num) => {
        const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
        if (num < 12) return satuan[num];
        if (num < 20) return toWords(num - 10) + " belas";
        if (num < 100) return satuan[Math.floor(num / 10)] + " puluh" + (num % 10 ? " " + toWords(num % 10) : "");
        if (num < 200) return "seratus" + (num % 100 ? " " + toWords(num % 100) : "");
        if (num < 1000) return satuan[Math.floor(num / 100)] + " ratus" + (num % 100 ? " " + toWords(num % 100) : "");
        if (num < 2000) return "seribu" + (num % 1000 ? " " + toWords(num % 1000) : "");
        if (num < 1000000) return toWords(Math.floor(num / 1000)) + " ribu" + (num % 1000 ? " " + toWords(num % 1000) : "");
        if (num < 1000000000) return toWords(Math.floor(num / 1000000)) + " juta" + (num % 1000000 ? " " + toWords(num % 1000000) : "");
        return num.toString();
    };

    number = parseInt(String(number).replace(/\D/g, ''), 10);
    if (isNaN(number) || number === 0) return "Nol Rupiah";

    let words = toWords(number).trim().replace(/\s+/g, ' ');

    words = words.charAt(0).toUpperCase() + words.slice(1);
    words = words.replace(/ ribu/g, ' Ribu').replace(/ juta/g, ' Juta');

    return words + " Rupiah";
}


function formatDate(dateStr) {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

// --- Lanjutkan kode utama script.js Anda di bawah ---

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
