export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  metadata?: {
    coinId?: string
    chartData?: any
    error?: string
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatRequest {
  message: string
  sessionId?: string
  context?: {
    currentCoins?: string[]
    timeRange?: string
  }
}

export interface ChatResponse {
  message: ChatMessage
  sessionId: string
  suggestions?: string[]
}

export interface ChatSuggestion {
  id: string
  text: string
  type: 'query' | 'action'
  icon?: string
}
