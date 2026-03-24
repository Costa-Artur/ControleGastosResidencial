import MenuBar from "@/components/menu-bar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Descrição do Gerenciador Financeiro Residencial",
};

type Props = {

}

export default function CategoriesPage(props: Props) {
    return (
        <div className="p-8">
            <MenuBar/>
        </div>
    )
}