"use client";

import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";

interface Tag {
  id: number;
  name: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  is_feature_note?: boolean;
  feature_date?: string | null;
}

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  formatDate: (dateString: string, isFutureNote?: boolean) => string;
}

export default function NoteModal({
  note,
  onClose,
  formatDate,
}: NoteModalProps) {
  // Escape tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex-1 pr-2">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
              {note.title}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <AccessTimeIcon fontSize="small" className="w-4 h-4" />
                <span>Güncellendi: {formatDate(note.updated_at)}</span>
              </div>
              {note.created_at !== note.updated_at && (
                <span className="text-gray-400 text-xs">
                  Oluşturuldu: {formatDate(note.created_at)}
                </span>
              )}
            </div>

            {/* Future Note Badge */}
            {note.is_feature_note && note.feature_date && (
              <div className="mt-3 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-purple-900/40 dark:to-blue-800/40 border-2 border-blue-400 dark:border-blue-600 rounded-lg shadow-md">
                  <svg
                    className="w-4 h-4 text-blue-700 dark:text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-200">
                      Hatırlatma:{" "}
                      {new Date(note.feature_date).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800/50 px-2 py-0.5 rounded">
                      Kalan: {formatDate(note.feature_date, true)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 flex-shrink-0"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {note.tags && note.tags.length > 0 && (
                <>
                  <LocalOfferIcon
                    className="text-gray-500 flex-shrink-0"
                    fontSize="small"
                  />
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-500/20 dark:text-blue-300"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Edit Button */}
            <button
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto justify-center"
              onClick={() => {
                // TODO: Navigate to edit page
                console.log("Edit note:", note.id);
              }}
            >
              <EditIcon fontSize="small" />
              Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
