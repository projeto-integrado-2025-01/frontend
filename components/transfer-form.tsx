"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

export default function TransferForm() {
  const [pixKeyType, setPixKeyType] = useState<string>("")
  const [pixKey, setPixKey] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isPixKeyEnabled, setIsPixKeyEnabled] = useState<boolean>(false)

  useEffect(() => {
    setIsPixKeyEnabled(!!pixKeyType)
    setPixKey("")
  }, [pixKeyType])

  // Função para formatar o valor em reais
  const formatCurrency = (value: string): string => {
    value = value.replace(/\D/g, "")

    if (value === "") return ""

    const valueNumber = Number.parseFloat(value) / 100
    return valueNumber.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  // Função para aplicar máscara de CPF com limitação
  const formatCPF = (value: string): string => {
    value = value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)
    value = value.replace(/(\d{3})(\d)/, "$1.$2")
    value = value.replace(/(\d{3})(\d)/, "$1.$2")
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return value
  }

  // Função para aplicar máscara de CNPJ com limitação
  const formatCNPJ = (value: string): string => {
    value = value.replace(/\D/g, "")
    if (value.length > 14) value = value.slice(0, 14)
    value = value.replace(/^(\d{2})(\d)/, "$1.$2")
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2")
    value = value.replace(/(\d{4})(\d)/, "$1-$2")
    return value
  }

  // Função para aplicar máscara de telefone com limitação
  const formatPhone = (value: string): string => {
    value = value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
    return value
  }

  // Função para lidar com a mudança no campo de valor
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "")
    setAmount(formatCurrency(value))
  }

  // Função para lidar com a mudança no campo de chave PIX
  const handlePixKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    switch (pixKeyType) {
      case "cpf":
        value = formatCPF(value)
        break
      case "cnpj":
        value = formatCNPJ(value)
        break
      case "celular":
        value = formatPhone(value)
        break
      default:
        break
    }

    setPixKey(value)
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/transferencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          tipoChave: pixKeyType,
          chavePix: pixKey,
          valor: Number.parseFloat(amount.replace(/[^\d,]/g, "").replace(",", ".")),
          data: date ? format(date, "yyyy-MM-dd") : "",
        }),
      })

      if (response.ok) {
        alert("Transferência agendada com sucesso!")
        // Limpar formulário
        setPixKeyType("")
        setPixKey("")
        setAmount("")
        setDate(new Date())
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message}`)
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao processar transferência")
    }
  }

  return (
    <div className="w-full max-w-md bg-black border border-[#D4AF37] rounded-lg shadow-lg p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#D4AF37]">Transferência PIX</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pixKeyType" className="text-[#D4AF37]">
            Tipo de Chave PIX
          </Label>
          <Select onValueChange={(value) => setPixKeyType(value)} value={pixKeyType}>
            <SelectTrigger className="bg-black text-white border-[#D4AF37] focus:ring-[#D4AF37]">
              <SelectValue placeholder="Selecione o tipo de chave" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-[#D4AF37]">
              <SelectItem value="cpf" className="hover:bg-gray-800">
                CPF
              </SelectItem>
              <SelectItem value="cnpj" className="hover:bg-gray-800">
                CNPJ
              </SelectItem>
              <SelectItem value="celular" className="hover:bg-gray-800">
                Celular
              </SelectItem>
              <SelectItem value="aleatoria" className="hover:bg-gray-800">
                Aleatória
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pixKey" className="text-[#D4AF37]">
            Chave PIX
          </Label>
          <Input
            id="pixKey"
            type="text"
            value={pixKey}
            onChange={handlePixKeyChange}
            disabled={!isPixKeyEnabled}
            placeholder={
              pixKeyType === "cpf"
                ? "000.000.000-00"
                : pixKeyType === "cnpj"
                  ? "00.000.000/0000-00"
                  : pixKeyType === "celular"
                    ? "(00) 00000-0000"
                    : pixKeyType === "aleatoria"
                      ? "Digite a chave aleatória"
                      : ""
            }
            className="bg-black text-white border-[#D4AF37] focus:ring-[#D4AF37] placeholder-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-[#D4AF37]">
            Valor
          </Label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="R$ 0,00"
            className="bg-black text-white border-[#D4AF37] focus:ring-[#D4AF37] placeholder-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-[#D4AF37]">
            Data da Transferência
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-black text-white border-[#D4AF37] hover:bg-gray-900 hover:text-[#D4AF37] data-[state=open]:bg-white data-[state=open]:text-black data-[state=open]:border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#D4AF37] data-[state=open]:text-gray-600" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-gray-300">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
                className="bg-white text-black"
                classNames={{
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                  day_today: "bg-gray-100 text-blue-600",
                  day: "hover:bg-gray-100",
                  head_cell: "text-gray-600",
                  cell: "text-black",
                  nav_button: "text-gray-600 hover:bg-gray-100",
                  nav_button_previous: "text-gray-600",
                  nav_button_next: "text-gray-600",
                  caption: "text-gray-900",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#B8860B] hover:text-black">
          Transferir
        </Button>
      </form>
    </div>
  )
}
