"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Search } from "lucide-react"

interface Transferencia {
  id: string
  tipo: "recebida" | "enviada"
  valor: number
  chavePix: string
  data: string
  descricao?: string
}

export default function ExtratoView() {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([])
  const [filtroData, setFiltroData] = useState<Date | undefined>()
  const [filtroChave, setFiltroChave] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  const buscarTransferencias = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3005/statement", {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) throw new Error("Erro ao buscar extrato")

      const json = await response.json()
      const dadosConvertidos: Transferencia[] = (json.statement || []).map((item: any) => ({
        id: String(item.id),
        tipo: "enviada",
        valor: item.value,
        chavePix: item.pixKey || "Chave não informada",
        data: item.createdAt,
        descricao: "Envio de Transferência",
      }))

      aplicarFiltros(dadosConvertidos)
    } catch (error) {
      console.error("Erro ao buscar extrato:", error)
      setTransferencias([])
    } finally {
      setIsLoading(false)
    }
  }

  const aplicarFiltros = (dados: Transferencia[]) => {
    let dadosFiltrados = [...dados]

    if (filtroData) {
      const dataFiltro = format(filtroData, "yyyy-MM-dd")
      dadosFiltrados = dadosFiltrados.filter((t) => t.data.startsWith(dataFiltro))
    }

    if (filtroChave) {
      dadosFiltrados = dadosFiltrados.filter((t) =>
          t.chavePix.toLowerCase().includes(filtroChave.toLowerCase())
      )
    }

    if (filtroTipo !== "all") {
      dadosFiltrados = dadosFiltrados.filter((t) => t.tipo === filtroTipo)
    }

    setTransferencias(dadosFiltrados)
  }

  useEffect(() => {
    buscarTransferencias()
  }, [])

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  return (
      <div className="w-full max-w-4xl bg-black border border-[#D4AF37] rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">Extrato de Transferências</h1>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transferencias.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                {isLoading ? "Carregando..." : "Nenhuma transferência encontrada"}
              </div>
          ) : (
              transferencias.map((transferencia) => (
                  <div
                      key={transferencia.id}
                      className="flex justify-between items-center p-4 border border-gray-700 rounded-lg hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                  <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                          transferencia.tipo === "recebida"
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                      }`}
                  >
                    {transferencia.tipo.toUpperCase()}
                  </span>
                      </div>
                      <div className="text-white font-medium">Chave: {transferencia.chavePix}</div>
                      <div className="text-gray-400 text-sm">{formatarData(transferencia.data)}</div>
                      {transferencia.descricao && (
                          <div className="text-gray-400 text-sm">{transferencia.descricao}</div>
                      )}
                    </div>
                    <div
                        className={`text-lg font-bold ${
                            transferencia.tipo === "recebida" ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {transferencia.tipo === "recebida" ? "+" : "-"} {formatarValor(transferencia.valor)}
                    </div>
                  </div>
              ))
          )}
        </div>

        {transferencias.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-sm">Total Recebido</div>
                  <div className="text-green-400 font-bold text-lg">
                    {formatarValor(
                        transferencias
                            .filter((t) => t.tipo === "recebida")
                            .reduce((sum, t) => sum + t.valor, 0)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Total Enviado</div>
                  <div className="text-red-400 font-bold text-lg">
                    {formatarValor(
                        transferencias
                            .filter((t) => t.tipo === "enviada")
                            .reduce((sum, t) => sum + t.valor, 0)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Saldo Líquido</div>
                  <div className="text-[#D4AF37] font-bold text-lg">
                    {formatarValor(
                        transferencias.reduce(
                            (sum, t) => sum + (t.tipo === "recebida" ? t.valor : -t.valor),
                            0
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
