// src/components/photo/SimplePhotoPicker.tsx
import { useRef } from "react";
import { Camera, RefreshCw, Trash2 } from "lucide-react";

interface Props {
  preview: string | null;
  uploading: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}

export function SimplePhotoPicker({
  preview,
  uploading,
  onPick,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPick(f);
    e.target.value = ""; // позволяет выбрать тот же файл повторно
  };

  // === С превью ===
  if (preview) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-3xl overflow-hidden bg-black aspect-[3/4]">
          <img
            src={preview}
            alt="Превью"
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить фото"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <Trash2 size={16} />
          </button>

          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <RefreshCw size={28} className="text-white animate-spin" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full text-sm text-primary font-medium py-2"
        >
          Заменить фото
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    );
  }

  // === Пусто — приглашение выбрать ===
  return (
    <label className="block w-full p-8 rounded-3xl border-2 border-dashed border-border bg-surface text-center cursor-pointer hover:border-primary/50 transition active:scale-[0.99]">
      <input
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera size={28} className="text-primary" strokeWidth={1.8} />
        </div>
        <p className="text-sm font-medium text-ink">
          Сделать или загрузить фото
        </p>
        <p className="text-xs text-muted max-w-[240px]">
          Просто для истории — анализ карты лица доступен в разделе «Анализ»
        </p>
      </div>
    </label>
  );
}