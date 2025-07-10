// Modelos de requisição para o backend

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    nome: string
  }
}

export interface TransferenciaRequest {
  tipoChave: string
  chavePix: string
  valor: number
  data: string
}

export interface TransferenciaResponse {
  id: string
  status: "sucesso" | "erro"
  message: string
}

export interface ExtratoRequest {
  data?: string // formato: YYYY-MM-DD
  chavePix?: string
  tipo?: "recebida" | "enviada"
  page?: number
  limit?: number
}

export interface ExtratoResponse {
  transferencias: Array<{
    id: string
    tipo: "recebida" | "enviada"
    valor: number
    chavePix: string
    data: string
    descricao?: string
    status: string
  }>
  total: number
  page: number
  totalPages: number
}

export interface TransferenciaLoteRequest {
  transferencias: Array<{
    chavePix: string
    valor: number
  }>
}

export interface TransferenciaLoteResponse {
  sucessos: number
  erros: number
  detalhes: string[]
  resultados: Array<{
    chavePix: string
    valor: number
    status: "sucesso" | "erro"
    message: string
  }>
}

// Funções de API
export const api = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  transferencia: async (data: TransferenciaRequest): Promise<TransferenciaResponse> => {
    const response = await fetch("/api/transferencia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  extrato: async (params: ExtratoRequest): Promise<ExtratoResponse> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString())
    })

    const response = await fetch(`/api/extrato?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
    return response.json()
  },

  transferencia_lote: async (data: TransferenciaLoteRequest): Promise<TransferenciaLoteResponse> => {
    const response = await fetch("/api/transferencia-lote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },
}
