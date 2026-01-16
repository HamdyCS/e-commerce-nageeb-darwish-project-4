import React from 'react'

export default function Loading() {
  return (
    <div className='flex items-center justify-center h-full w-full'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-300'></div>
    </div>
  )
}
