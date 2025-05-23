# Dosya Yönetim Sistemi

Bu proje, kullanıcıların PDF, PNG ve JPG formatındaki dosyaları yükleyebileceği, listeleyebileceği ve silebileceği bir .NET 8.0 tabanlı Web API uygulamasıdır. Kullanıcı kimlik doğrulama, dosya yönetimi ve güvenlik odaklıdır.

## Teknolojiler

- .NET 8.0
- Entity Framework Core
- MSSQL (SQL Server)
- JWT Authentication
- FluentValidation
- Swagger/OpenAPI

## Proje Yapısı

- **FileManagement.Core**: Domain entity'leri, arayüzler ve DTO'lar
- **FileManagement.Application**: İş mantığı ve servisler
- **FileManagement.Infrastructure**: Veri erişimi ve dış servisler
- **FileManagement.API**: API controller'ları ve endpoint'ler

## Kurulum

### Gereksinimler
- .NET 8.0 SDK
- MSSQL (SQL Server)
- Visual Studio 2022 veya Visual Studio Code

### Adımlar

1. Projeyi klonlayın:
```bash
git clone [repository-url]
cd FileManagement
```

2. Veritabanını oluşturun ve migration'ları uygulayın:
```bash
cd FileManagement.API
dotnet ef database update
```

3. `appsettings.json` dosyasında veritabanı bağlantı dizesini güncelleyin. 
Aşağıda örnek bağlantı dizesi verilmiştir. **Kendi MSSQL sunucu adresinizi, veritabanı adınızı ve kimlik bilgilerinizi kullanmalısınız:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FileManagementDb;User Id=sa;Password=your_password;TrustServerCertificate=True;"
  }
}
```

> Not: Eğer LocalDB kullanıyorsanız örnek bağlantı dizesi:
> 
> ```
> Server=(localdb)\\mssqllocaldb;Database=FileManagementDb;Trusted_Connection=True;MultipleActiveResultSets=true
> ```

4. JWT anahtarını güncelleyin:
```json
{
  "Jwt": {
    "Key": "your-super-secret-key-with-at-least-32-characters"
  }
}
```

5. Projeyi çalıştırın:
```bash
dotnet run --project FileManagement.API
```

## Seed (Varsayılan) Kullanıcı

Migration sonrası veritabanında otomatik olarak şu kullanıcı oluşur:
- **Kullanıcı adı:** admin
- **E-posta:** admin@example.com
- **Şifre:** Admin123!

Bu bilgilerle giriş yapıp API'yi test edebilirsiniz.

## API Endpoints

### Kimlik Doğrulama

#### Kullanıcı Kaydı
```http
POST /api/auth/register
Content-Type: application/json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

#### Kullanıcı Girişi
```http
POST /api/auth/login
Content-Type: application/json
{
    "email": "string",
    "password": "string"
}
```

#### Mevcut Kullanıcı Bilgileri
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Dosya İşlemleri

#### Dosya Yükleme
```http
POST /api/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
file: [dosya]
```

#### Dosya Listeleme
```http
GET /api/files
Authorization: Bearer {token}
```

#### Dosya Detayı
```http
GET /api/files/{fileId}
Authorization: Bearer {token}
```

#### Dosya Silme
```http
DELETE /api/files/{fileId}
Authorization: Bearer {token}
```

## Validasyon Kuralları

### Kullanıcı Kaydı
- Kullanıcı adı: 3-50 karakter, sadece harf, rakam ve alt çizgi
- Email: Geçerli email formatı
- Şifre: En az 6 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter

### Dosya Yükleme
- İzin verilen formatlar: PDF, PNG, JPG
- Maksimum dosya boyutu: 10MB

## Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifreler BCrypt ile hash'lenir
- Kullanıcı bazlı dosya erişim kontrolü
- Global exception handling

## Swagger UI
Swagger arayüzüne `https://localhost:5001/swagger` adresinden erişebilirsiniz.

