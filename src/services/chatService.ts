import apiClient from '@/lib/axios'
import { ChatRequest, ChatResponse, ChatSession, ChatMessage } from '@/types'

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/chat/message', request)
  },

  async getSessions(): Promise<ChatSession[]> {
    return apiClient.get<ChatSession[]>('/chat/sessions')
  },

  async getSession(sessionId: string): Promise<ChatSession> {
    return apiClient.get<ChatSession>(`/chat/sessions/${sessionId}`)
  },

  async createSession(title?: string): Promise<ChatSession> {
    return apiClient.post<ChatSession>('/chat/sessions', { title })
  },

  async deleteSession(sessionId: string): Promise<void> {
    return apiClient.delete<void>(`/chat/sessions/${sessionId}`)
  },

  async updateSession(sessionId: string, title: string): Promise<ChatSession> {
    return apiClient.put<ChatSession>(`/chat/sessions/${sessionId}`, { title })
  },

  async getSuggestions(): Promise<string[]> {
    return apiClient.get<string[]>('/chat/suggestions')
  },

  async getPopularQueries(): Promise<string[]> {
    return apiClient.get<string[]>('/chat/popular-queries')
  },
}
