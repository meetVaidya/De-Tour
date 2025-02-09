import React from 'react'
import { cn } from '../utils/cn'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className={cn(
          'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
