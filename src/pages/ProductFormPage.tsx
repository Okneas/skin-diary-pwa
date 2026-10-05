// src/pages/ProductFormPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUploadProductPhoto,
  useDeleteProductPhoto,
} from "@/hooks/useProducts";
import { getFullStorageUrl } from "@/utils/storage";
import { PRODUCT_CATEGORIES } from "@/types";
import type { ProductOut } from "@/types";
import { cn } from "@/utils/cn";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== "new";
  const productId = isEdit ? Number(id) : 0;

  const { data: product, isLoading } = useProduct(productId);

  if (isEdit && isLoading) {
    return (
      <div className="px-5 pt-8 max-w-md mx-auto space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // key — ремаунт формы при переключении между средствами
  return (
    <ProductFormInner
      key={product?.id ?? "new"}
      isEdit={isEdit}
      productId={productId}
      product={product ?? null}
    />
  );
}

// ============================================================
// Внутренний компонент — без useEffect
// ============================================================
// src/pages/ProductFormPage.tsx — только внутренний компонент
function ProductFormInner({
  isEdit,
  productId,
  product,
}: {
  isEdit: boolean;
  productId: number;
  product: ProductOut | null;
}) {
  const navigate = useNavigate();
  const toast = useToast((s) => s.push);

  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [category, setCategory] = useState<string | null>(
    product?.category ?? null
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 👇 новое: фото, выбранное до сохранения (только для create)
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(productId);
  const deleteMutation = useDeleteProduct();
  const uploadPhoto = useUploadProductPhoto(productId);
  const deletePhoto = useDeleteProductPhoto(productId);

  const canSubmit = name.trim().length >= 2;

  // === Выбор фото в create-режиме ===
  const handlePendingPhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingPhoto(f);
    setPendingPreview(URL.createObjectURL(f));
  };

  const clearPendingPhoto = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPhoto(null);
    setPendingPreview(null);
  };

  // === Отправка формы ===
  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload = {
      name: name.trim(),
      brand: brand.trim() || null,
      category: category,
      description: description.trim() || null,
    };

    if (isEdit) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast("success", "Средство обновлено");
          navigate(-1);
        },
        onError: () => toast("error", "Не удалось сохранить"),
      });
    } else {
      createMutation.mutate(
        { data: payload, photo: pendingPhoto },
        {
          onSuccess: (created) => {
            toast("success", "Средство добавлено");
            navigate(`/products/${created.id}`, { replace: true });
          },
          onError: () => toast("error", "Не удалось создать"),
        }
      );
    }
  };

  // === Загрузка фото в edit-режиме (существующее) ===
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    uploadPhoto.mutate(f, {
      onSuccess: () => toast("success", "Фото загружено"),
      onError: () => toast("error", "Не удалось загрузить фото"),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(productId, {
      onSuccess: () => {
        toast("success", "Средство удалено");
        navigate("/products", { replace: true });
      },
      onError: () => toast("error", "Не удалось удалить"),
    });
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadPhoto.isPending;

  // === Какой URL показывать в превью: pending (create) или существующее (edit) ===
  const previewUrl = pendingPreview
    ? pendingPreview
    : product?.photo_path
    ? getFullStorageUrl(product.photo_path)
    : null;

  return (
    <div className="px-5 pt-8 pb-32 max-w-md mx-auto">
      <header className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        {isEdit && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-10 h-10 rounded-full bg-surface shadow-soft flex items-center justify-center"
            aria-label="Удалить"
          >
            <Trash2 size={16} className="text-danger" />
          </button>
        )}
      </header>

      <h1 className="text-2xl font-display text-ink mb-5">
        {isEdit ? "Средство" : "Новое средство"}
      </h1>

      {/* Фото — теперь в ОБОИХ режимах */}
      <Card className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted mb-3">
          Фото
        </p>

        {previewUrl ? (
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-surface-2">
            <img
              src={previewUrl}
              alt={name || "Средство"}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                if (isEdit) deletePhoto.mutate();
                else clearPendingPhoto();
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
              aria-label="Удалить фото"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="block aspect-square rounded-2xl border-2 border-dashed border-border bg-surface-2 cursor-pointer hover:border-primary/50 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={isEdit ? handlePhotoUpload : handlePendingPhotoPick}
              disabled={uploadPhoto.isPending}
            />
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera size={24} className="text-primary" strokeWidth={1.8} />
              </div>
              <p className="text-sm text-muted">
                {uploadPhoto.isPending ? "Загружаем…" : "Добавить фото"}
              </p>
            </div>
          </label>
        )}
      </Card>

      {/* Данные — без изменений */}
      <Card className="mb-4">
        <div className="space-y-4">
          <Input
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, увлажняющий крем"
          />
          <Input
            label="Бренд"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Необязательно"
          />
          <div>
            <label className="text-sm text-muted mb-2 block">Категория</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(active ? null : c)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-ink border-border"
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-sm text-muted mb-2 block">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Зачем используете, как часто и т.д."
              className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-border text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary transition resize-none"
            />
          </div>
        </div>
      </Card>

      <Button
        fullWidth
        size="lg"
        onClick={handleSubmit}
        disabled={!canSubmit || isPending}
      >
        <span className="inline-flex items-center gap-2">
          <Save size={18} />
          {isEdit ? "Сохранить" : "Добавить"}
        </span>
      </Button>

      {/* Sheet удаления — без изменений */}
      <Sheet
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Удалить средство?"
      >
        <p className="text-sm text-muted mb-5">
          Оно исчезнет из списка, но останется в прошлых записях дневника
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>
            Отмена
          </Button>
          <Button
            fullWidth
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-danger hover:bg-danger/90 text-white"
          >
            <span className="inline-flex items-center gap-2">
              <Trash2 size={16} />
              Удалить
            </span>
          </Button>
        </div>
      </Sheet>
    </div>
  );
}