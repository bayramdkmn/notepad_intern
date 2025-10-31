import NoteCard from "@/components/dashboard/NoteCard";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export default function NotesGrid() {
  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <NoteCard
            key={i}
            title={
              i === 0
                ? "Proje Lansman Toplantısı"
                : i === 1
                ? "Haftalık Alışveriş Listesi"
                : "Yeni API Entegrasyonu Fikirleri"
            }
            description={
              i === 0
                ? "Pazarlama stratejisi, bütçe dağılımı ve lansman takvimi üzerine önemli kararlar alındı. Anahtar metrikler belirlendi ve görev atamaları yapıldı..."
                : i === 1
                ? "Süt, ekmek, yumurta, zeytin, peynir ve meyve suyu alınacak. Bu hafta sebze ağırlıklı beslenmeye dikkat edilecek, brokoli ve ıspanak unutulmamalı."
                : "Uygulamamız için Stripe ödeme altyapısı ve Google Maps lokasyon servisi entegrasyonlarını değerlendiriyoruz. Olası zorluklar ve faydaları..."
            }
            updatedText={
              i === 0 ? "2 gün önce" : i === 1 ? "5 gün önce" : "1 hafta önce"
            }
            tags={i === 1 ? ["Kişisel"] : i === 0 ? ["Proje X", "İş"] : ["İş"]}
          />
        ))}
        <div className="col-span-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl dark:bg-zinc-800/40 dark:border-zinc-700 cursor-pointer hover:scale-95 duration-300 transition-all">
          <NoteAddIcon fontSize="large" />
          <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">
            Yeni Not Oluştur
          </h3>
          <p className="text-gray-500 max-w-xs text-sm">
            Yeni bir not oluşturarak fikirlerinizi yakalayın.
          </p>
        </div>
      </div>
    </div>
  );
}
