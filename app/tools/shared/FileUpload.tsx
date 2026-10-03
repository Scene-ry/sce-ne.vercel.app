import React, { useRef } from 'react'
import { useDragAndDrop } from './useDragAndDrop'

const UPLOAD_ICON_SVG = (
  <svg
    className="w-14 h-14 mb-3 transition-colors"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const UPLOAD_ICON_SVG_SMALL = (
  <svg
    className="w-4.5 h-4.5 mr-2 transition-transform"
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
      className={`rounded-xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200 ${
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border bg-surface hover:border-muted'
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
        <div className={isDragging ? 'text-primary' : 'text-muted'}>
          {UPLOAD_ICON_SVG}
        </div>
        <span
          className={`text-base font-semibold mb-1.5 transition-colors ${
            isDragging ? 'text-primary' : 'text-foreground'
          }`}
        >
          {isDragging ? dropFileHere : uploadPrompt}
        </span>
        <span className="text-sm text-muted">
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
        className={`flex-1 cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          isDragging
            ? 'bg-primary text-white border-2 border-primary scale-105'
            : 'bg-surface-hover text-foreground hover:bg-border border border-border'
        }`}
        {...dragHandlers}
      >
        <div className={isDragging ? 'scale-110' : ''}>{UPLOAD_ICON_SVG_SMALL}</div>
        {isDragging ? dropFileHere : buttonText}
      </label>
    </>
  )
}
