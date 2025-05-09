// Function to convert numbers to Indonesian words
function convertNumberToWords(number) {
    const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
    const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
    const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
    const scales = ['', 'Ribu', 'Juta', 'Miliar', 'Triliun'];

    function convertGroup(n) {
        let str = '';
        if (n >= 100) {
            if (Math.floor(n / 100) === 1) {
                str += 'Seratus ';
            } else {
                str += units[Math.floor(n / 100)] + ' Ratus ';
            }
            n = n % 100;
        }
        
        if (n >= 20) {
            str += tens[Math.floor(n / 10)] + ' ';
            n = n % 10;
        } else if (n >= 10) {
            str += teens[n - 10] + ' ';
            n = 0;
        }
        
        if (n > 0) {
            str += units[n] + ' ';
        }
        
        return str.trim();
    }

    if (number === 0) return 'Nol Rupiah';
    
    let str = '';
    let groupIndex = 0;
    
    while (number > 0) {
        const n = number % 1000;
        if (n !== 0) {
            const words = convertGroup(n);
            if (groupIndex === 1 && n === 1) {
                str = 'Seribu ' + str;
            } else {
                str = words + ' ' + scales[groupIndex] + ' ' + str;
            }
        }
        number = Math.floor(number / 1000);
        groupIndex++;
    }
    
    return str.trim() + ' Rupiah';
}

// Format number with thousand separator
function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Format date to Indonesian format
function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Update receipt preview
function updatePreview() {
    const noKwitansi = document.getElementById('noKwitansi').value;
    const tanggal = document.getElementById('tanggal').value;
    const terimaDari = document.getElementById('terimaDari').value;
    const nominal = document.getElementById('nominal').value.replace(/\D/g, '');
    const untukPembayaran = document.getElementById('untukPembayaran').value;
    const penerima = document.getElementById('penerima').value;
    
    // Update preview elements
    document.getElementById('previewNo').textContent = noKwitansi || '-';
    document.getElementById('previewTanggal').textContent = tanggal ? formatDate(tanggal) : '-';
    document.getElementById('previewTerimaDari').textContent = terimaDari || '-';
    
    if (nominal) {
        const formattedNominal = formatNumber(nominal);
        const words = convertNumberToWords(parseInt(nominal));
        document.getElementById('previewUangSebanyak').textContent = words;
        document.getElementById('previewTerbilang').textContent = formattedNominal;
    } else {
        document.getElementById('previewUangSebanyak').textContent = '-';
        document.getElementById('previewTerbilang').textContent = '-';
    }
    
    document.getElementById('previewUntukPembayaran').textContent = untukPembayaran || '-';
    document.getElementById('previewPenerima').textContent = penerima || '';
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('kwitansiForm');
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Format nominal input
    const nominalInput = document.getElementById('nominal');
    nominalInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = formatNumber(value);
        }
        e.target.value = value;
    });
    
    // Download functionality
    document.getElementById('downloadBtn').addEventListener('click', function() {
        const receipt = document.getElementById('receiptPreview');
        html2canvas(receipt).then(canvas => {
            const link = document.createElement('a');
            link.download = 'kwitansi.png';
            link.href = canvas.toDataURL();
            link.click();
        }).catch(error => {
            console.error('Error generating receipt:', error);
            alert('Terjadi kesalahan saat mengunduh kwitansi. Silakan coba lagi.');
        });
    });
});
