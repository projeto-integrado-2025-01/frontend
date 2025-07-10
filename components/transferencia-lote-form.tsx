"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"

interface TransferenciaLote {
  chavePix: string
  valor: number
  linha: number
}

export default function TransferenciaLoteForm() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [transferencias, setTransferencias] = useState<TransferenciaLote[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultado, setResultado] = useState<{
    sucesso: number
    erro: number
    detalhes: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArquivo(file)
    }
  }

  const enviarTransferencias = async () => {
    if (!arquivo) return

    setIsProcessing(true)
    setResultado(null)

    const formData = new FormData()
    formData.append("file", arquivo)

    try {
      const response = await fetch("http://localhost:3005/transactions/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResultado({
          sucesso: data.sucessos,
          erro: data.erros,
          detalhes: data.detalhes || [],
        })
      } else {
        throw new Error(data.message || "Erro ao processar transferências")
      }
    } catch (error) {
      console.error("Erro:", error)
      setResultado({
        sucesso: 0,
        erro: 1,
        detalhes: ["Erro ao conectar com o servidor"],
      })
    } finally {
      setIsProcessing(false)
    }
  }


  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <div className="w-full max-w-4xl bg-black border border-[#D4AF37] rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-2">Transferência PIX em Lote</h1>
        <p className="text-gray-400 text-sm">Faça upload de um arquivo Excel com as colunas: Chave PIX, Valor</p>
      </div>

      <div className="space-y-6">
        {/* Upload de Arquivo */}
        <div className="space-y-2">
          <Label className="text-[#D4AF37]">Arquivo Excel</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="bg-black text-white border-[#D4AF37] focus:ring-[#D4AF37] file:bg-[#D4AF37] file:text-black file:border-0 file:rounded file:px-3 file:py-1"
            />
            {arquivo && (
              <div className="flex items-center text-green-400">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span className="text-sm">{arquivo.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview das Transferências */}
        {transferencias.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#D4AF37]">Preview - {transferencias.length} transferências</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {transferencias.map((transferencia, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-gray-700 rounded">
                  <div>
                    <div className="text-white font-medium">{transferencia.chavePix}</div>
                    <div className="text-gray-400 text-sm">Linha {transferencia.linha}</div>
                  </div>
                  <div className="text-[#D4AF37] font-bold">{formatarValor(transferencia.valor)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-900 rounded">
              <span className="text-white font-semibold">Total:</span>
              <span className="text-[#D4AF37] font-bold text-lg">
                {formatarValor(transferencias.reduce((sum, t) => sum + t.valor, 0))}
              </span>
            </div>

            <Button
              onClick={enviarTransferencias}
              disabled={isProcessing}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#B8860B] disabled:opacity-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isProcessing ? "Processando..." : "Enviar Transferências"}
            </Button>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#D4AF37]">Resultado do Processamento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-green-900 rounded">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                <div>
                  <div className="text-green-400 font-semibold">Sucessos</div>
                  <div className="text-white text-2xl font-bold">{resultado.sucesso}</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-900 rounded">
                <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
                <div>
                  <div className="text-red-400 font-semibold">Erros</div>
                  <div className="text-white text-2xl font-bold">{resultado.erro}</div>
                </div>
              </div>
            </div>
            {resultado.detalhes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[#D4AF37] font-semibold">Detalhes:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {resultado.detalhes.map((detalhe, index) => (
                    <div key={index} className="text-gray-400 text-sm p-2 bg-gray-900 rounded">
                      {detalhe}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
