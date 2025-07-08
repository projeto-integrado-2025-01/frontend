"use client"

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Receipt, Send, Upload, LogOut } from "lucide-react"

export default function MenuDropdown() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = () => {
    // Aqui você pode limpar tokens, cookies, etc.
    localStorage.removeItem("authToken")
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-black text-[#D4AF37] border-[#D4AF37] hover:bg-gray-900">
          <Menu className="h-4 w-4 mr-2" />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black border-[#D4AF37]">
        <DropdownMenuItem
          onClick={() => handleNavigation("/extrato")}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Receipt className="mr-2 h-4 w-4 text-[#D4AF37]" />
          <span>Extrato</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation("/transferencia")} className="text-white hover:bg-gray-800 cursor-pointer">
          <Send className="mr-2 h-4 w-4 text-[#D4AF37]" />
          <span>Transferência PIX</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigation("/transferencia-lote")}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Upload className="mr-2 h-4 w-4 text-[#D4AF37]" />
          <span>Transferência em Lote</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#D4AF37]" />
        <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-gray-800 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
