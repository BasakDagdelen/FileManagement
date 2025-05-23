// API URL
const API_URL = 'https://localhost:5002/api';

// Token yönetimi
const TOKEN_KEY = 'auth_token';

// Token'ı localStorage'dan al
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Token'ı localStorage'a kaydet
function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// Token'ı localStorage'dan sil
function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Kullanıcı girişi
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Giriş başarısız');
        }

        const data = await response.json();
        setToken(data.token);
        return data;
    } catch (error) {
        throw error;
    }
}

// Kullanıcı kaydı
async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            throw new Error('Kayıt başarısız');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// Kullanıcı bilgilerini al
async function getCurrentUser() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Token bulunamadı');
        }

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bilgileri alınamadı');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Form event listener'ları
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await login(email, password);
        Swal.fire({
            icon: 'success',
            title: 'Başarılı!',
            text: 'Giriş başarıyla yapıldı.'
        }).then(() => {
            window.location.reload();
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: error.message
        });
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await register(username, email, password);
        Swal.fire({
            icon: 'success',
            title: 'Başarılı!',
            text: 'Kayıt başarıyla tamamlandı. Giriş yapabilirsiniz.'
        }).then(() => {
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: error.message
        });
    }
});

// Çıkış yap
document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    removeToken();
    window.location.reload();
});

// Sayfa yüklendiğinde kullanıcı durumunu kontrol et
document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (token) {
        try {
            const user = await getCurrentUser();
            document.getElementById('loginNav').classList.add('d-none');
            document.getElementById('registerNav').classList.add('d-none');
            document.getElementById('dashboardNav').classList.remove('d-none');
            document.getElementById('logoutNav').classList.remove('d-none');
            document.getElementById('dashboardContent').classList.remove('d-none');
        } catch (error) {
            removeToken();
        }
    }
}); 