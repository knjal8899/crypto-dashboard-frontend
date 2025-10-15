import React, { useState } from 'react'
import { Button } from '@/components/ui'
import apiClient from '@/lib/axios'

const BackendTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testBackendConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing backend connection...\n')
    
    try {
      // Test 1: Basic connectivity
      setTestResult(prev => prev + '1. Testing basic connectivity...\n')
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      setTestResult(prev => prev + `   Base URL: ${baseURL}\n`)
      
      // Test 2: Try to fetch top coins
      setTestResult(prev => prev + '2. Testing /coins/top endpoint...\n')
      try {
        const response = await apiClient.get('/coins/top?limit=5')
        setTestResult(prev => prev + `   ✅ Success: Got ${Array.isArray(response) ? response.length : 'unknown'} coins\n`)
        setTestResult(prev => prev + `   Response: ${JSON.stringify(response, null, 2)}\n`)
      } catch (error: any) {
        setTestResult(prev => prev + `   ❌ Failed: ${error.message}\n`)
        if (error.response) {
          setTestResult(prev => prev + `   Status: ${error.response.status}\n`)
          setTestResult(prev => prev + `   Data: ${JSON.stringify(error.response.data, null, 2)}\n`)
        }
      }
      
      // Test 3: Check authentication
      setTestResult(prev => prev + '3. Testing authentication...\n')
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      setTestResult(prev => prev + `   Access Token: ${accessToken ? 'Present' : 'Missing'}\n`)
      setTestResult(prev => prev + `   Refresh Token: ${refreshToken ? 'Present' : 'Missing'}\n`)
      
      if (accessToken) {
        try {
          const userResponse = await apiClient.get('/auth/me')
          setTestResult(prev => prev + `   ✅ Auth Success: ${JSON.stringify(userResponse, null, 2)}\n`)
        } catch (error: any) {
          setTestResult(prev => prev + `   ❌ Auth Failed: ${error.message}\n`)
        }
      }
      
    } catch (error: any) {
      setTestResult(prev => prev + `❌ General Error: ${error.message}\n`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      <Button 
        onClick={testBackendConnection}
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? 'Testing...' : 'Test Backend Connection'}
      </Button>
      {testResult && (
        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto max-h-96 whitespace-pre-wrap">
          {testResult}
        </pre>
      )}
    </div>
  )
}

export default BackendTest
