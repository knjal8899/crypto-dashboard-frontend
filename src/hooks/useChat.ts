import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatService } from '@/services/chatService'
import { QUERY_KEYS } from '@/utils/constants'
import { ChatRequest, ChatResponse, ChatSession } from '@/types'

export function useChatSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.SESSIONS,
    queryFn: chatService.getSessions,
    staleTime: 300000, // 5 minutes
  })
}

export function useChatSession(sessionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.SESSION_BY_ID(sessionId),
    queryFn: () => chatService.getSession(sessionId),
    enabled: !!sessionId,
    staleTime: 300000,
  })
}

export function useChatSuggestions() {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.SUGGESTIONS,
    queryFn: chatService.getSuggestions,
    staleTime: 600000, // 10 minutes
  })
}

export function usePopularQueries() {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT.POPULAR_QUERIES,
    queryFn: chatService.getPopularQueries,
    staleTime: 600000, // 10 minutes
  })
}

export function useChatQuery() {
  return useMutation({
    mutationFn: (text: string) => chatService.query(text),
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: async (request: ChatRequest) => {
      // First, try the GET /chat/query endpoint for specific questions
      try {
        const queryResponse = await chatService.query(request.message)
        // If it's a price or trend query, format the response as a ChatResponse
        if (queryResponse.answer) {
          // Format the response based on the query type
          let formattedAnswer = queryResponse.answer
          
          // If it's a price query, add current price info
          if (queryResponse.coin && queryResponse.price_usd) {
            formattedAnswer = `${queryResponse.answer}\n\nCurrent ${queryResponse.coin} price: $${queryResponse.price_usd.toLocaleString()}`
          }
          
          // If it's a trend query with prices, add summary
          if (queryResponse.prices && Array.isArray(queryResponse.prices) && queryResponse.prices.length > 0) {
            const firstPrice = queryResponse.prices[0][1]
            const lastPrice = queryResponse.prices[queryResponse.prices.length - 1][1]
            const change = ((lastPrice - firstPrice) / firstPrice) * 100
            const changeText = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
            formattedAnswer = `${queryResponse.answer}\n\nPrice change: ${changeText} (${queryResponse.days || 7} days)`
          }
          
          return {
            message: {
              id: Date.now().toString(),
              content: formattedAnswer,
              role: 'assistant',
              timestamp: new Date().toISOString(),
              metadata: queryResponse, // Store full query response in metadata
            },
            sessionId: request.sessionId, // Maintain session if provided
          } as ChatResponse
        }
      } catch (error) {
        // If query fails (e.g., 404, invalid query), fall back to general message
        console.warn('Chat query failed, falling back to general message:', error)
      }
      // Fallback to POST /chat/message for general chat or if query failed
      return chatService.sendMessage(request)
    },
    onSuccess: (data: ChatResponse) => {
      if (data.sessionId) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.CHAT.SESSION_BY_ID(data.sessionId) 
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.SESSIONS })
    },
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (title?: string) => chatService.createSession(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.SESSIONS })
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (sessionId: string) => chatService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.SESSIONS })
    },
  })
}

export function useUpdateSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
      chatService.updateSession(sessionId, title),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.SESSIONS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.SESSION_BY_ID(sessionId) })
    },
  })
}
