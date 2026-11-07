"use client";

import Header from "@/component_front/Header";
import UserInfo from "@/component_front/UserInfo";
import "./globals.css";
import Footer from "@/component_front/Footer";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { Dispatch, SetStateAction } from "react";
import { fetchProducts, Product } from "./data/products";
import { Badge } from "@/components/tailgrids/core/badge";
import type { Credential } from "./data/credential";
import { CREDENTIAL_CHANGE_EVENT, doLogout } from "../utils/login";

type GlobalDataContextValue = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: Dispatch<SetStateAction<Product[]>>;
};

export const globalsDataContext = createContext<GlobalDataContextValue | null>(
  null,
);

export const useGlobalData = () => {
  const context = useContext(globalsDataContext);
  if (context === null) {
    throw new Error("useGlobalData must be used within the root layout");
  }
  return context;
};

const isValidCredential = (value: unknown): value is Credential => {
  if (typeof value !== "object" || value === null) return false;
  const credential = value as Record<string, unknown>;
  return (
    typeof credential.token === "string" &&
    credential.token.length > 0 &&
    typeof credential.email === "string" &&
    typeof credential.name === "string" &&
    typeof credential.role === "string"
  );
};

const subscribeToAuth = (callback: () => void) => {
  const handleStorageChange = () => callback();
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(CREDENTIAL_CHANGE_EVENT, handleStorageChange);
  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(CREDENTIAL_CHANGE_EVENT, handleStorageChange);
  };
};

const getAuthSnapshot = () => {
  const storedCredential = window.localStorage.getItem("credential");
  if (storedCredential === null) return false;

  try {
    return isValidCredential(JSON.parse(storedCredential));
  } catch (error) {
    if (error instanceof SyntaxError) {
      window.localStorage.removeItem("credential");
      return false;
    }
    throw error;
  }
};

const getServerAuthSnapshot = () => null;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  useEffect(() => {
    if (pathname !== "/login" && isAuthenticated === false) {
      localStorage.setItem("returnPath", pathname);
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  const canAccessPage = pathname === "/login" || isAuthenticated === true;

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data as Product[]))
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      });
  }, []);

  const handleLogout = () => {
    doLogout(router, "/login");
  };

  return (
    <html>
      <body>
        <globalsDataContext.Provider
          value={{ products, setProducts, carts, setCarts }}
        >
          {isAuthenticated === true && pathname !== "/login" && (
            <>
              <Header />
              <UserInfo />
              <nav className="mt-4 flex justify-center gap-4">
                <Link href={"/"}>
                  <Button
                    appearance={pathname === "/" ? "fill" : "outline"}
                    variant="primary"
                  >
                    Home
                  </Button>
                </Link>
                <Link href={"/animation"}>
                  <Button
                    appearance={pathname === "/animation" ? "fill" : "outline"}
                    variant="primary"
                  >
                    Animation
                  </Button>
                </Link>
                <Link href={"/calculator"}>
                  <Button
                    appearance={pathname === "/calculator" ? "fill" : "outline"}
                    variant="primary"
                  >
                    Calculator
                  </Button>
                </Link>
                <Link href={"/todos"}>
                  <Button
                    appearance={pathname === "/todos" ? "fill" : "outline"}
                    variant="primary"
                  >
                    Todos
                  </Button>
                </Link>
                <div className="relative">
                  <Link
                    href="/products"
                    className={buttonStyles({
                      appearance: pathname === "/products" ? "fill" : "outline",
                      variant: "primary",
                    })}
                  >
                    Products
                  </Link>
                  <Badge
                    size={"sm"}
                    className="absolute -right-2 -top-2 bg-red-600 text-white"
                  >
                    {products.length}
                  </Badge>
                </div>
                <div className="relative">
                  <Link
                    href="/carts"
                    className={buttonStyles({
                      appearance: pathname === "/carts" ? "fill" : "outline",
                      variant: "primary",
                    })}
                  >
                    Carts
                  </Link>
                  <Badge
                    size={"sm"}
                    className="absolute -right-2 -top-2 bg-red-600 text-white"
                  >
                    {carts.length}
                  </Badge>
                </div>
                <Button
                  appearance={"outline"}
                  variant="danger"
                  className="ml-1"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </nav>
            </>
          )}
          <main>
            {canAccessPage ? (
              children
            ) : (
              <p className="p-6 text-center" role="status">
                Checking login...
              </p>
            )}
          </main>
          {isAuthenticated === true && pathname !== "/login" && <Footer />}
        </globalsDataContext.Provider>
      </body>
    </html>
  );
}
