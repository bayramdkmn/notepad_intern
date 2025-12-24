# AI Destekli Not Uygulaması (Backend)

Bu proje, kullanıcıların kişisel notlarını oluşturup yönetebileceği, etiketleyebileceği ve yapay zeka destekli özelliklerle notlar üzerinde daha verimli çalışabileceği bir **FastAPI backend** uygulamasıdır.

Uygulama; klasik CRUD işlemlerinin yanında **semantik arama**, **otomatik özetleme** ve **AI destekli etiket üretme** gibi özellikler sunar.  
Veriler **PostgreSQL** üzerinde saklanır, yapay zeka işlemleri **ChatGPT** kullanılarak gerçekleştirilir.

---

## Projenin Amacı

- FastAPI ile gerçekçi bir backend API geliştirmek  
- PostgreSQL + SQLAlchemy kullanımını pekiştirmek  
- JWT tabanlı authentication yapısını uygulamak  
- Yapay zekayı backend süreçlerine entegre etmek  
- Not yönetimi üzerine kapsamlı bir API geliştirmek  

---

## Özellikler

### Kullanıcı & Güvenlik
- Kullanıcı kayıt ve giriş
- JWT (Access & Refresh Token)
- Oturum yenileme
- Kullanıcı çıkış işlemleri

### Not Yönetimi
- Not oluşturma, güncelleme, silme
- Soft delete & hard delete
- Arşivleme
- Favori ve pinleme
- Önceliklendirme
- Not istatistikleri
- Not versiyonlama

### Etiket Sistemi
- Etiket oluşturma, güncelleme, silme
- Nota etiket ekleme / çıkarma
- Etiket bazlı not listeleme
- En çok kullanılan etiketler

### Yapay Zeka Destekli
- Not özetleme
- Otomatik etiket üretme
- Embedding tabanlı semantik arama

### Ek Özellikler
- Not export (Markdown / PDF)
- Not import (Markdown / JSON)

---

## Kullanılan Teknolojiler

- **FastAPI**
- **PostgreSQL**
- **SQLAlchemy**
- **JWT**
- **ChatGPT**

---

## Proje Yapısı (Özet)

![img.png](img.png)

---

## Projeyi İndirme ve Çalıştırma

### 1. Projeyi Klonla
```bash
git clone https://github.com/kullanici-adi/proje-adi.git
cd proje-adi
```

### 2. Proje Paketlerinin Yüklenmesi
```
pip install -r requirements.txt
```

### 3.Veritabanı Ayarlamaları (.env file)
```
DATABASE_URL=postgresql://username:password@localhost:5432/db_name
```

### Uygulamanın Çalıştırılması

#### *Production (main.py ile aynı dizinde olmak şartı)*
```
fastapi run main.py
```

#### *Development (main.py ile aynı dizinde olmak şartı)*
```
fastapi dev main.py
```

#### (İsteğe bağlı uvicorn üzerinden de çalıştırılabilir.)