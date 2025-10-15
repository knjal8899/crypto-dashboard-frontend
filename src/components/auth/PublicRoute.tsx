import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui'

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Verifying authentication...
          </p>
        </div>
      </div>
    )
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // If not authenticated, render the public content (login/register)
  return <>{children}</>
}

export default PublicRoute
