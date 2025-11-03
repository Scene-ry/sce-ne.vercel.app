import React, { useRef } from 'react'
import { useDragAndDrop } from './useDragAndDrop'

const UPLOAD_ICON_SVG = (
  <svg
    className="w-16 h-16 mb-4 transition-colors"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const UPLOAD_ICON_SVG_SMALL = (
  <svg
    className="w-5 h-5 mr-2 transition-transform"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  isDragging?: boolean
  dragHandlers?: {
    onDragEnter: (e: React.DragEvent<HTMLElement>) => void
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void
    onDragOver: (e: React.DragEvent<HTMLElement>) => void
    onDrop: (e: React.DragEvent<HTMLElement>) => void
  }
  uploadPrompt?: string
  dropFileHere?: string
  releaseToUpload?: string
  fileTypeHint?: string
}

export function FileUploadZone({
  onFileSelect,
  accept = '.bin',
  isDragging: externalIsDragging,
  dragHandlers: externalDragHandlers,
  uploadPrompt = 'Click to upload file',
  dropFileHere = 'Drop file here',
  releaseToUpload = 'Release to upload',
  fileTypeHint = 'Only .bin files are supported',
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const internalDragAndDrop = useDragAndDrop(onFileSelect)

  const isDragging = externalIsDragging ?? internalDragAndDrop.isDragging
  const dragHandlers = externalDragHandlers ?? internalDragAndDrop.dragHandlers

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed p-12 text-center transition-all ${
        isDragging
          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105'
          : 'border-gray-300 dark:border-gray-600'
      }`}
      {...dragHandlers}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-zone"
      />
      <label htmlFor="file-upload-zone" className="cursor-pointer inline-flex flex-col items-center">
        <div className={isDragging ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400'}>
          {UPLOAD_ICON_SVG}
        </div>
        <span
          className={`text-lg font-semibold mb-2 transition-colors ${
            isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {isDragging ? dropFileHere : uploadPrompt}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isDragging ? releaseToUpload : fileTypeHint}
        </span>
      </label>
    </div>
  )
}

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string
  isDragging?: boolean
  dragHandlers?: {
    onDragEnter: (e: React.DragEvent<HTMLElement>) => void
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void
    onDragOver: (e: React.DragEvent<HTMLElement>) => void
    onDrop: (e: React.DragEvent<HTMLElement>) => void
  }
  buttonText?: string
  dropFileHere?: string
  inputId?: string
}

export function FileUploadButton({
  onFileSelect,
  accept = '.bin',
  isDragging: externalIsDragging,
  dragHandlers: externalDragHandlers,
  buttonText = 'Choose File',
  dropFileHere = 'Drop file here',
  inputId = 'file-upload-button',
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const internalDragAndDrop = useDragAndDrop(onFileSelect)

  const isDragging = externalIsDragging ?? internalDragAndDrop.isDragging
  const dragHandlers = externalDragHandlers ?? internalDragAndDrop.dragHandlers

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" id={inputId} />
      <label
        htmlFor={inputId}
        className={`flex-1 cursor-pointer inline-flex items-center justify-center p-3 rounded-lg font-semibold transition-all ${
          isDragging
            ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400 scale-105'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
        {...dragHandlers}
      >
        <div className={isDragging ? 'scale-110' : ''}>{UPLOAD_ICON_SVG_SMALL}</div>
        {isDragging ? dropFileHere : buttonText}
      </label>
    </>
  )
}
