import React from "react";
import { Note, Tag } from "@/providers/NotesProvider";
import Tooltip from "@mui/material/Tooltip";
import { useNotes } from "@/providers/NotesProvider";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  formatDate: (dateString: string, relative?: boolean) => string;
  formatFullDate: (dateString: string) => string;
}

export default function NoteCard({
  note,
  onClick,
  formatDate,
  formatFullDate,
}: NoteCardProps) {
  const { togglePin } = useNotes();

  const handlePinClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Not kartına tıklamayı engelle
    await togglePin(note.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer overflow-hidden min-h-[180px] flex flex-col ${
        note.is_pinned
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-200/60 dark:hover:shadow-blue-900/40"
          : note.is_feature_note && note.feature_date
          ? "bg-white dark:bg-zinc-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
          : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30"
      } hover:-translate-y-1`}
    >
      {/* Üst çizgi indicator - Tüm notlar için */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          note.is_pinned && note.is_feature_note && note.feature_date
            ? "bg-gradient-to-r from-blue-500 via-slate-500 to-blue-500" // Hem pinned hem future
            : note.is_pinned
            ? "bg-gradient-to-r from-blue-400 to-blue-600" // Sadece pinned
            : note.is_feature_note && note.feature_date
            ? "bg-gradient-to-r from-green-800 to-green-600" // Sadece future
            : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" // Normal not
        }`}
      ></div>

      {/* Header - Başlık ve İkonlar */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={`flex-1 text-lg font-bold transition-colors line-clamp-2 flex items-baseline gap-2 ${
            note.is_pinned
              ? "text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300"
              : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
          }`}
        >
          <Tooltip title={"Not Başlığı"} placement="top">
            <span className="line-clamp-2">{note.title}</span>
          </Tooltip>
          {/* Priority Badge - Modern */}
          {note.priority && (
            <Tooltip
              title={
                note.priority === "High"
                  ? "Yüksek Öncelik"
                  : note.priority === "Medium"
                  ? "Orta Öncelik"
                  : "Düşük Öncelik"
              }
              placement="top"
            >
              <span
                className={`flex items-center flex-shrink-0 px-3 py-0.3 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  note.priority === "High"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : note.priority === "Medium"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {note.priority === "High"
                  ? "!!!"
                  : note.priority === "Medium"
                  ? "!!"
                  : "!"}
              </span>
            </Tooltip>
          )}
        </h3>

        {/* Pinned Icon */}
        <Tooltip
          title={note.is_pinned ? "İşareti Kaldır" : "İşaretle"}
          placement="top"
        >
          <svg
            onClick={handlePinClick}
            className="w-6 h-6 text-blue-600 dark:text-blue-400 cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
            fill={note.is_pinned ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={note.is_pinned ? 0 : 2}
            viewBox="0 0 24 24"
          >
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
        </Tooltip>
      </div>

      {/* Taglar */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-auto">
          {note.tags.slice(0, 3).map((tag: Tag) => (
            <Tooltip key={tag.id} title={"Etiket"} placement="top">
              <span
                key={tag.id}
                className="inline-block px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md dark:bg-blue-500/10 dark:text-blue-300"
              >
                {tag.name}
              </span>
            </Tooltip>
          ))}
          {note.tags.length > 3 && (
            <span className="inline-block px-2.5 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-400">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Future Note Badge */}
      {/* {note.is_feature_note && note.feature_date && (
        <div className="mt-3">
          <span className="inline-block text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800/70 rounded-md shadow-sm">
            İLERİ TARİHLİ
          </span>
        </div>
      )} */}

      {/* Tarih Bilgisi - Alt kısım */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-700">
        {note.is_feature_note && note.feature_date ? (
          <div className="space-y-2">
            <Tooltip title="Hedef Tarih" placement="top-start" arrow>
              {/* Gelecek Tarih */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {formatFullDate(note.feature_date)}
                </span>
              </div>
            </Tooltip>
            {/* Kalan Süre veya Tarihi Geçmiş */}
            <div className="text-end text-xs text-slate-600 dark:text-slate-400">
              {new Date(note.feature_date).getTime() > new Date().getTime() ? (
                <>
                  Kalan:{" "}
                  <span className="font-medium">
                    {formatDate(note.feature_date, true)}
                  </span>
                </>
              ) : (
                <span className="font-medium text-red-600 dark:text-red-400">
                  Tarihi Geçmiş
                </span>
              )}
            </div>
            {/* Oluşturulma Tarihi */}
            <div className="text-xs text-end text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-zinc-700">
              <span className="whitespace-pre-line">
                Oluşturulma Tarihi: {formatFullDate(note.created_at)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-end text-xs text-gray-500 dark:text-gray-400">
            <span className="whitespace-pre-line">
              Oluşturulma Tarihi: {formatFullDate(note.created_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
