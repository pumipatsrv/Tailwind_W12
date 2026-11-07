"use client";
import { useGlobalData } from "../layout";
import { Product } from "../data/products";
import Image from "next/image";
import { buttonStyles } from "@/components/tailgrids/core/button";
import { Badge } from "@/components/tailgrids/core/badge";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";
import { useEffect } from "react";

export default function Page() {
  const { products, setProducts, carts, setCarts } = useGlobalData();
    const router = useRouter()
      useEffect(() => checkLogin(router, '/carts'), [router])
      
  const removeFromCarts = (product: Product) => {
    // remove product from carts
    setCarts(carts.filter((p: Product) => p.id !== product.id));

    // append product back to products
    setProducts([...products, product]);
  };

  // calculate total count and price
  const totalCount = carts.length;
  const totalPrice = carts.reduce((sum: number, p: Product) => sum + p.price, 0);

  return (
    <div>
    <div className="bg-cyan-50 w-3xl mx-auto h-[calc(80vh-100px)] mt-4 border border-gray-300 rounded-2xl overflow-y-auto">
      {/* Cart Items Grid */}
      <div className="grid grid-cols-5 gap-4 p-4">
          {carts.map((product: Product) => (
            <div key={product.id} className="border rounded-2xl">
              <div className="relative">
                <Image
                  src={product.thumbnailUrl}
                  alt="Image"
                  width={150}
                  height={150}
                  className="w-full rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm text-white text-xs p-1 line-clamp-2">
                  {product.title}
                </div>
                <div className="absolute top-1 right-1 bg-black/30 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded">
                  ${product.price}
                </div>
              </div>
              <div
                className={buttonStyles({ className: "bg-red-500" })}
                onClick={() => removeFromCarts(product)}
              >
                Remove
              </div>
            </div>
          ))}
      </div>
      
      {/* Empty State */}
      {carts.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          ไม่มีสินค้า
        </div>
      )}
      
    </div >
    <div className="flex justify-center gap-2 mt-4">
      <Badge className="bg-yellow-400 text-black text-sm py-2 px-4 rounded-xl">
          Count: {totalCount} items
        </Badge>
        <Badge className="bg-red-500 text-white text-sm py-2 px-4 rounded-xl">
          Price: ${totalPrice.toFixed(2)}
        </Badge>
    </div>
    
    </div>
  );
}