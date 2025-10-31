export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Kayıt Ol</h1>
      <form className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            className="border rounded px-3 py-2"
            placeholder="Adınız Soyadınız"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            className="border rounded px-3 py-2"
            placeholder="ornek@site.com"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            className="border rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white rounded px-4 py-2"
        >
          Kayıt Ol
        </button>
      </form>
    </main>
  );
}
