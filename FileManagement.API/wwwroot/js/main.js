// Sayfa yüklendiğinde çalışacak genel kodlar
document.addEventListener('DOMContentLoaded', () => {
    // Drag & Drop alanını oluştur
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    
    const dragDropArea = document.createElement('div');
    dragDropArea.className = 'drag-drop-area';
    dragDropArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt fa-3x mb-3"></i>
        <p>Dosyaları buraya sürükleyin veya seçin</p>
    `;
    
    uploadForm.insertBefore(dragDropArea, fileInput.parentElement);
    fileInput.style.display = 'none';

    // Drag & Drop olayları
    dragDropArea.addEventListener('click', () => fileInput.click());

    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.classList.add('dragover');
    });

    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.classList.remove('dragover');
    });

    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            uploadForm.dispatchEvent(new Event('submit'));
        }
    });

    // Dosya seçildiğinde otomatik yükle
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            uploadForm.dispatchEvent(new Event('submit'));
        }
    });

    // Loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-overlay d-none';
    spinner.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
        </div>
    `;
    document.body.appendChild(spinner);

    // API isteklerinde loading spinner'ı göster/gizle
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        spinner.classList.remove('d-none');
        try {
            const response = await originalFetch(...args);
            return response;
        } finally {
            spinner.classList.add('d-none');
        }
    };
});

const API_URL = 'https://localhost:5002/api'; 