"use client";

import Image from "next/image";
import { useGlobalData } from "../layout";
import { Product } from "../data/products";

export default function Page() {
  const { products, setProducts, carts, setCarts } = useGlobalData();

  const addToCarts = (product: Product) => {
    // remove product from products
    setProducts(products.filter((p: Product) => p.id !== product.id));

    // append product to carts
    setCarts([...carts, product]);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pb-2 pt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Products
        </h1>
        <p className="mt-1 text-sm text-slate-500">{`สินค้าทั้งหมด ${products.length} รายการ`}</p>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <p className="text-4xl">🛍️</p>
            <p className="mt-3 font-semibold text-slate-700">ไม่มีสินค้าให้เลือก</p>
            <p className="mt-1 text-sm text-slate-500">
              สินค้าอาจกำลังโหลด หรือถูกเพิ่มลงตะกร้าครบแล้ว
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-square bg-slate-100">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-3">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-slate-800">
                    {product.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-indigo-600">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => addToCarts(product)}
                      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
                    >
                      + เพิ่ม
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}