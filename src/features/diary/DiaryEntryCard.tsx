import { ChevronRight, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { formatDate } from "@/utils/date";
import type { DiaryEntryListItem } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  entry: DiaryEntryListItem;
  previous?: DiaryEntryListItem | null;
  index?: number;
}

export function DiaryEntryCard({ entry, previous, index = 0 }: Props) {
  const navigate = useNavigate();

  // Дельта только если тип старения совпадает
  const delta =
    previous &&
    previous.leading_aging_type === entry.leading_aging_type &&
    previous.leading_aging_score != null &&
    entry.leading_aging_score != null
      ? entry.leading_aging_score - previous.leading_aging_score
      : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => navigate(`/diary/${entry.id}`)}
      className="w-full text-left"
    >
      <Card className="flex items-center gap-3 hover:bg-surface/80 transition">
        <div
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center shrink-0",
            "bg-gradient-to-br text-primary"
          )}
        >
          <NotebookPen size={18} strokeWidth={1.8} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink font-medium">
            {formatDate(entry.recorded_at)}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {entry.leading_aging_type ? (
              <span className="text-xs text-muted truncate">
                {entry.leading_aging_type}
                {entry.leading_aging_score != null && (
                  <> · {Math.round(entry.leading_aging_score)}</>
                )}
              </span>
            ) : (
              <span className="text-xs text-muted">Без расчёта</span>
            )}
            {delta != null && (
              <TrendBadge delta={delta} invertColors suffix="" />
            )}
          </div>
          {entry.note && (
            <p className="text-xs text-muted mt-1 truncate">
              «{entry.note}»
            </p>
          )}
        </div>

        <ChevronRight size={18} className="text-muted shrink-0" />
      </Card>
    </motion.button>
  );
}