document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const filesList = document.getElementById('filesList');
    const searchInput = document.getElementById('searchInput');
    const spinner = document.getElementById('spinner');
    const emptyMessage = document.getElementById('emptyMessage');

    // Spinner göster/gizle
    function showSpinner() { spinner.style.display = 'flex'; }
    function hideSpinner() { spinner.style.display = 'none'; }

    // Dosya yükleme işlemi
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const files = fileInput.files;
        if (files.length === 0) {
            alert('Lütfen bir dosya seçin');
            return;
        }
        const formData = new FormData();
        for (let file of files) {
            formData.append('files', file);
        }
        showSpinner();
        try {
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('Dosyalar başarıyla yüklendi');
                fileInput.value = '';
                await loadFiles();
            } else {
                alert('Dosya yükleme başarısız');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Dosya yükleme sırasında bir hata oluştu');
        }
        hideSpinner();
    });

    // Dosyaları listele
    async function loadFiles() {
        showSpinner();
        try {
            const response = await fetch('/api/files');
            const files = await response.json();
            displayFiles(files);
        } catch (error) {
            console.error('Hata:', error);
        }
        hideSpinner();
    }

    // Dosyaları görüntüle
    function displayFiles(files) {
        filesList.innerHTML = '';
        if (!files || files.length === 0) {
            emptyMessage.style.display = 'block';
            filesList.appendChild(emptyMessage);
            return;
        } else {
            emptyMessage.style.display = 'none';
        }
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-name"><i class='fa-regular fa-file'></i> ${file.name}</div>
                <div class="file-info">
                    <div>Boyut: ${formatFileSize(file.size)}</div>
                    <div>Yüklenme: ${new Date(file.uploadDate).toLocaleDateString()}</div>
                </div>
                <div class="file-actions">
                    <button onclick="downloadFile('${file.id}')"><i class='fa-solid fa-download'></i> İndir</button>
                    <button onclick="deleteFile('${file.id}')"><i class='fa-solid fa-trash'></i> Sil</button>
                </div>
            `;
            filesList.appendChild(fileItem);
        });
    }

    // Dosya boyutunu formatla
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Dosya indirme
    window.downloadFile = async (fileId) => {
        showSpinner();
        try {
            const response = await fetch(`/api/files/download/${fileId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } else {
                alert('Dosya indirme başarısız');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Dosya indirme sırasında bir hata oluştu');
        }
        hideSpinner();
    };

    // Dosya silme
    window.deleteFile = async (fileId) => {
        if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
            showSpinner();
            try {
                const response = await fetch(`/api/files/${fileId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Dosya başarıyla silindi');
                    await loadFiles();
                } else {
                    alert('Dosya silme başarısız');
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Dosya silme sırasında bir hata oluştu');
            }
            hideSpinner();
        }
    };

    // Arama işlevi
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            const fileName = item.querySelector('.file-name').textContent.toLowerCase();
            if (fileName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Sayfa yüklendiğinde dosyaları listele
    loadFiles();
}); 