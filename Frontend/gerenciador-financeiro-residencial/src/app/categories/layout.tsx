import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias",
};

type CategoriesLayoutProps = {
  children: React.ReactNode;
};

export default function CategoriesLayout({ children }: Readonly<CategoriesLayoutProps>) {
  return children;
}