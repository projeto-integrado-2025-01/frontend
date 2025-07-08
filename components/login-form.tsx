"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aqui você faria a requisição para seu backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        // Login bem-sucedido, redirecionar para a página principal
        router.push("/")
      } else {
        alert("Credenciais inválidas")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      alert("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-black border border-[#D4AF37] rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center mb-6">
        <Image src="/images/logo_banco.png" alt="EasyPay Logo" width={120} height={60} className="mb-4" />
        <h1 className="text-2xl font-bold text-[#D4AF37]">Login</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#D4AF37]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            className="bg-black text-white border-[#D4AF37] focus:ring-[#D4AF37] placeholder-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#D4AF37]">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="bg-black text-white border-[#D4AF37] focus:ring-[#D4AF37] placeholder-gray-500"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#D4AF37] text-black hover:bg-[#B8860B] hover:text-black disabled:opacity-50"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  )
}
