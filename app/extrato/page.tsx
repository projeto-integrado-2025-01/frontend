import ExtratoView from "@/components/extrato-view"
import MenuDropdown from "@/components/menu-dropdown"
import Image from "next/image"

export default function ExtratoPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="flex justify-between items-center p-6">
        <Image src="/images/logo_banco.png" alt="EasyPay Logo" width={120} height={60} />
        <MenuDropdown />
      </div>
      <div className="flex items-center justify-center p-4">
        <ExtratoView />
      </div>
    </main>
  )
}
