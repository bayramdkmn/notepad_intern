export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Şifre Sıfırla</h1>
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
        <button
          type="submit"
          className="w-full bg-black text-white rounded px-4 py-2"
        >
          Sıfırlama Bağlantısı Gönder
        </button>
      </form>
    </main>
  );
}
