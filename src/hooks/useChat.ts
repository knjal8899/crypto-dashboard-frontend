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
  
  return useMutation({
    mutationFn: (request: ChatRequest) => chatService.sendMessage(request),
    onSuccess: (data: ChatResponse) => {
      // Invalidate the specific session to refetch messages
      if (data.sessionId) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.CHAT.SESSION_BY_ID(data.sessionId) 
        })
      }
      // Also invalidate sessions list to update last message time
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
