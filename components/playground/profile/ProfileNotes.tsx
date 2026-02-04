"use client";

import { useTranslations } from "next-intl";
import { NostrNote } from "@/lib/graph/types";
import NoteCard from "./NoteCard";
import { Button } from "@/components/ui";

interface ProfileNotesProps {
  notes: NostrNote[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * Notes feed section for profile modal
 */
export default function ProfileNotes({
  notes,
  isLoading,
  hasMore,
  onLoadMore,
}: ProfileNotesProps) {
  const t = useTranslations("playground");

  return (
    <div className="p-6">
      {/* Section header */}
      <h3 className="text-sm font-medium text-gray-300 mb-4">
        {t("graph.recentNotes")}
      </h3>

      {/* Loading state (initial) */}
      {isLoading && notes.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-400">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">{t("graph.loadingNotes")}</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && notes.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-gray-600 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">{t("graph.noNotes")}</p>
        </div>
      )}

      {/* Notes list */}
      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Load more button */}
      {notes.length > 0 && hasMore && (
        <div className="mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("graph.loadingNotes")}
              </span>
            ) : (
              t("graph.loadMore")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
