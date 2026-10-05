// src/components/product/ProductPicker.tsx
import { useMemo, useState } from "react";
import { Check, Package, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import { getFullStorageUrl } from "@/utils/storage";
import { cn } from "@/utils/cn";

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function ProductPicker({ selectedIds, onChange }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useProducts();
  const products = useMemo(() => data?.items ?? [], [data]);
  
  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [products, selectedIds]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <>
      {/* Кнопка-триггер */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full p-3.5 rounded-2xl border flex items-center gap-3 text-left transition",
          selectedIds.length > 0
            ? "bg-primary/10 border-primary"
            : "bg-surface border-border"
        )}
      >
        <span
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
            selectedIds.length > 0 ? "bg-primary text-white" : "bg-surface-2 text-muted"
          )}
        >
          <Package size={18} strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink font-medium">
            {selectedIds.length > 0
              ? `Выбрано: ${selectedIds.length}`
              : "Выбрать средства"}
          </p>
          {selectedProducts.length > 0 && (
            <p className="text-xs text-muted truncate">
              {selectedProducts.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
      </button>

      {/* Bottom Sheet со списком */}
      <Sheet open={open} onClose={() => setOpen(false)} title="Мои средства">
        {/* Поиск */}
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию или бренду"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-2 border border-border text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Кнопка "Добавить средство" */}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            navigate("/products/new");
          }}
          className="w-full mb-3 p-3.5 rounded-2xl border-2 border-dashed border-border flex items-center gap-3 text-left hover:border-primary/50 transition"
        >
          <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Plus size={18} className="text-primary" strokeWidth={2} />
          </span>
          <span className="text-sm text-primary font-medium">
            Добавить новое средство
          </span>
        </button>

        {/* Список */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">
            {products.length === 0
              ? "Пока нет средств — добавьте первое"
              : "Ничего не найдено"}
          </p>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto no-scrollbar">
            {filtered.map((p) => {
              const active = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={cn(
                    "w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition",
                    active
                      ? "bg-primary/10 border-primary"
                      : "bg-surface border-border"
                  )}
                >
                  <div className="w-11 h-11 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
                    {p.photo_path ? (
                      <img
                        src={getFullStorageUrl(p.photo_path)}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={18} className="text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium truncate">
                      {p.name}
                    </p>
                    {p.brand && (
                      <p className="text-xs text-muted truncate">{p.brand}</p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition",
                      active
                        ? "bg-primary text-white"
                        : "border-2 border-border"
                    )}
                  >
                    {active && <Check size={12} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <Button
          fullWidth
          className="mt-4"
          onClick={() => setOpen(false)}
        >
          Готово{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
        </Button>
      </Sheet>
    </>
  );
}