import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transações",
};

type CategoriesLayoutProps = {
  children: React.ReactNode;
};

export default function CategoriesLayout({ children }: Readonly<CategoriesLayoutProps>) {
  return children;
}