export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Giriş Yap</h1>
      <form className="space-y-4">
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
          Giriş Yap
        </button>
      </form>
      <div className="mt-4 text-sm">
        <a className="underline" href="/reset-password">
          Şifremi unuttum
        </a>
      </div>
    </main>
  );
}
