// src/components/product/ProductCard.tsx
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { getFullStorageUrl } from "@/utils/storage";
import type { ProductOut } from "@/types";

interface Props {
  product: ProductOut;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="text-left w-full"
    >
      <Card interactive className="flex gap-3">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
          {product.photo_path ? (
            <img
              src={getFullStorageUrl(product.photo_path)}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Package size={24} className="text-muted" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-sm font-medium text-ink truncate">
            {product.name}
          </p>
          {product.brand && (
            <p className="text-xs text-muted truncate">{product.brand}</p>
          )}
          {product.category && (
            <span className="text-[10px] uppercase tracking-wider text-primary mt-1">
              {product.category}
            </span>
          )}
        </div>
      </Card>
    </motion.button>
  );
}