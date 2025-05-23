// Dosya yükleme
async function uploadFile(file) {
    const token = getToken();
    if (!token) {
        throw new Error('Oturum açmanız gerekiyor');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Dosya yüklenemedi');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Dosyaları listele
async function getFiles() {
    const token = getToken();
    if (!token) {
        throw new Error('Oturum açmanız gerekiyor');
    }

    try {
        const response = await fetch(`${API_URL}/files`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Dosyalar alınamadı');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Dosya sil
async function deleteFile(fileId) {
    const token = getToken();
    if (!token) {
        throw new Error('Oturum açmanız gerekiyor');
    }

    try {
        const response = await fetch(`${API_URL}/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Dosya silinemedi');
        }

        return true;
    } catch (error) {
        throw error;
    }
}

// Dosya listesini güncelle
async function updateFileList() {
    try {
        const files = await getFiles();
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = document.createElement('i');
            fileIcon.className = 'file-icon fas fa-file';
            if (file.fileType === 'pdf') {
                fileIcon.className = 'file-icon fas fa-file-pdf';
            } else if (['png', 'jpg', 'jpeg'].includes(file.fileType)) {
                fileIcon.className = 'file-icon fas fa-file-image';
            }

            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.innerHTML = `
                <div class="fw-bold">${file.fileName}</div>
                <small class="text-muted">${new Date(file.uploadDate).toLocaleString()}</small>
            `;

            const fileActions = document.createElement('div');
            fileActions.className = 'file-actions';
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.onclick = async () => {
                try {
                    await Swal.fire({
                        title: 'Emin misiniz?',
                        text: 'Bu dosyayı silmek istediğinizden emin misiniz?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Evet, sil',
                        cancelButtonText: 'İptal'
                    });

                    await deleteFile(file.id);
                    await updateFileList();
                    Swal.fire('Başarılı!', 'Dosya silindi.', 'success');
                } catch (error) {
                    Swal.fire('Hata!', error.message, 'error');
                }
            };

            fileActions.appendChild(deleteButton);
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(fileActions);
            fileList.appendChild(fileItem);
        });
    } catch (error) {
        Swal.fire('Hata!', error.message, 'error');
    }
}

// Dosya yükleme formu
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        Swal.fire('Hata!', 'Lütfen bir dosya seçin.', 'error');
        return;
    }

    try {
        await uploadFile(file);
        fileInput.value = '';
        await updateFileList();
        Swal.fire('Başarılı!', 'Dosya başarıyla yüklendi.', 'success');
    } catch (error) {
        Swal.fire('Hata!', error.message, 'error');
    }
});

// Sayfa yüklendiğinde dosya listesini güncelle
document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    if (token) {
        updateFileList();
    }
});

const API_URL = 'https://localhost:5002/api'; 