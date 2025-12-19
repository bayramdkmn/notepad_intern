# 📝 Notepad AI - React Native Expo Uygulaması

iOS 26 destekli, NativeWind (Tailwind CSS), Dark/Light Mode ve tam özellikli bir not alma uygulaması.

## ✨ Özellikler

### 🔐 Authentication
- ✅ Login (Giriş Yap)
- ✅ Register (Kayıt Ol)
- ✅ Forgot Password (Şifremi Unuttum)
- ✅ Form validasyonu
- ✅ Auth Context ile state yönetimi

### 📱 Ana Özellikler
- ✅ **Sidebar Navigation** - Web benzeri drawer menü (sabit sidebar)
- ✅ **Notlar Sayfası** - Not listesi ve arama
- ✅ **Etiketler Sayfası** - Not organizasyonu için etiketler
- ✅ **Ayarlar Sayfası** - Tema değiştirme ve kullanıcı yönetimi
- ✅ **Dark/Light Mode** - Aktif çalışan tema değiştirici
- ✅ **Modern UI/UX** - Şık ve responsive tasarım

### 🛠️ Teknolojiler
- ✨ **NativeWind v4** - Tailwind CSS for React Native
- 📱 **iOS 26 Desteği** - En güncel Expo SDK (v54)
- 🎨 **React Navigation** - Stack + Drawer navigation
- 🔄 **TypeScript** - Tip güvenli kod
- ⚡ **React Native 0.81.5** - En güncel React Native sürümü

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# iOS için gerekli pod'ları yükle (sadece macOS)
cd ios && pod install && cd ..
```

## 🚀 Çalıştırma

```bash
# Development server'ı başlat
npm start

# iOS'ta çalıştır
npm run ios

# Android'de çalıştır
npm run android

# Web'de çalıştır
npm run web
```

## 📁 Proje Yapısı

```
mobile/
├── src/
│   ├── screens/           # Tüm ekranlar
│   │   ├── auth/          # Auth ekranları (Login, Register, ForgotPassword)
│   │   └── main/          # Ana ekranlar (Notes, Tags, Settings)
│   ├── components/        # Yeniden kullanılabilir componentler
│   │   ├── common/        # Ortak componentler (Button, Input)
│   │   └── sidebar/       # Sidebar component
│   ├── navigation/        # Navigation yapısı
│   │   ├── AuthNavigator.tsx    # Auth stack navigation
│   │   ├── MainNavigator.tsx    # Main drawer navigation
│   │   └── RootNavigator.tsx    # Root navigation logic
│   ├── context/           # Context API
│   │   └── AuthContext.tsx      # Authentication context
│   ├── types/             # TypeScript tip tanımlamaları
│   │   └── index.ts
│   ├── constants/         # Sabitler (theme, colors, vb)
│   │   └── theme.ts
│   ├── hooks/             # Custom hooks (gelecekte)
│   └── utils/             # Yardımcı fonksiyonlar (gelecekte)
├── App.tsx                # Ana uygulama entry point
├── global.css             # Tailwind CSS stilleri
├── tailwind.config.js     # Tailwind yapılandırması
├── metro.config.js        # Metro bundler yapılandırması
├── babel.config.js        # Babel yapılandırması
└── app.json               # Expo yapılandırması
```

## 🎨 Ekranlar

### Authentication Flow
1. **Login Screen** - E-posta ve şifre ile giriş
2. **Register Screen** - Yeni kullanıcı kaydı
3. **Forgot Password Screen** - Şifre sıfırlama

### Main App Flow
1. **Notes Screen** - Not listesi ve arama
2. **Tags Screen** - Etiket yönetimi
3. **Settings Screen** - Uygulama ayarları ve tema değiştirme

## 🎯 Navigation Yapısı

```
RootNavigator
├── AuthNavigator (Stack) - Kullanıcı giriş yapmadıysa
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── MainNavigator (Drawer) - Kullanıcı giriş yaptıysa
    ├── Notes
    ├── Tags
    └── Settings
```

## 🌓 Dark/Light Mode

Uygulama NativeWind'in `useColorScheme` hook'unu kullanır:

```typescript
import { useColorScheme } from "nativewind";

const { colorScheme, setColorScheme } = useColorScheme();
```

Tema değiştirmek için:
```typescript
setColorScheme(colorScheme === "light" ? "dark" : "light");
```

## 🔧 Önemli Komponentler

### Button Component
```typescript
<Button
  title="Giriş Yap"
  onPress={handleLogin}
  loading={isLoading}
  variant="primary" // primary | secondary | outline
  fullWidth
/>
```

### Input Component
```typescript
<Input
  label="E-posta"
  placeholder="ornek@email.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  isPassword={false}
/>
```

## 📝 Context Kullanımı

### Auth Context
```typescript
import { useAuth } from "./src/context/AuthContext";

const { user, login, logout, register, resetPassword, isLoading } = useAuth();
```

## 🎨 Tailwind Class Kullanımı

Dark mode için `dark:` prefix kullanın:

```typescript
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Merhaba Dünya
  </Text>
</View>
```

## 🔜 Yapılacaklar

- [ ] Not oluşturma/düzenleme/silme işlevleri
- [ ] Backend API entegrasyonu
- [ ] AsyncStorage ile local data persistence
- [ ] Not detay sayfası
- [ ] Etiket filtreleme
- [ ] Arama optimizasyonu
- [ ] Push notifications
- [ ] Biometric authentication (Touch ID / Face ID)
- [ ] Not paylaşma
- [ ] Markdown desteği

## 📦 Bağımlılıklar

```json
{
  "expo": "~54.0.25",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "nativewind": "^4.2.1",
  "tailwindcss": "^3.4.18",
  "@react-navigation/native": "^x.x.x",
  "@react-navigation/native-stack": "^x.x.x",
  "@react-navigation/drawer": "^x.x.x",
  "react-native-gesture-handler": "^x.x.x",
  "react-native-reanimated": "^4.1.5",
  "react-native-safe-area-context": "^x.x.x",
  "react-native-screens": "^x.x.x"
}
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

Bu proje modern React Native best practices kullanılarak geliştirilmiştir.

---

**Not:** Bu uygulama hala geliştirme aşamasındadır. Backend API entegrasyonu yapılması gerekmektedir.
