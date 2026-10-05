// src/pages/ProductsPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Package } from "lucide-react";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useProducts();

  const products = data?.items ?? [];

  return (
    <Screen>
      <header className="flex items-center gap-3 mb-5 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-2xl font-display text-ink">Мои средства</h1>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Пока нет средств"
          description="Добавьте свою косметику — потом сможете отмечать, чем пользовались в конкретный день"
          action={
            <Button onClick={() => navigate("/products/new")}>
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                Добавить средство
              </span>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              Всего средств
            </p>
            <p className="text-xs text-muted">{products.length}</p>
          </div>

          <div className="space-y-3 pb-24">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate("/products/new")}
        aria-label="Новое средство"
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary text-white shadow-soft flex items-center justify-center active:scale-95 transition z-30"
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>
    </Screen>
  );
}