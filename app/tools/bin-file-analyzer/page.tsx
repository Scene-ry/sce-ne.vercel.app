'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { useLanguage } from '@/contexts/LanguageContext'

import { IIDX_VERSION_32 } from '../shared/constants'
import { downloadFile } from '../shared/fileUtils'
import { useDragAndDrop } from '../shared/useDragAndDrop'
import { FileUploadButton, FileUploadZone } from '../shared/FileUpload'
import { BUTTON_PRIMARY, BUTTON_RED } from '../shared/commonStyles'
import BinFileItem, { createEmptyBinFileItem } from './BinFileItem'
import buildBinFileContent from './BinFileBuilder'
import parseBinFile from './BinFileParser'
import { decodeHtmlEntity } from './StringUtil'
import { getRelativePosAndLen } from './versions'
import ItemDetailsForm from './ItemDetailsForm'

const HEAD_VERSION_POS = 4

export default function BinFileAnalyzer() {
  const { t } = useLanguage()
  const jsonInputRef = useRef<HTMLInputElement>(null)

  // State
  const [fileName, setFileName] = useState<string>('')
  const [items, setItems] = useState<BinFileItem[]>([])
  const [selectedItem, setSelectedItem] = useState<BinFileItem | null>(null)
  const [formData, setFormData] = useState<BinFileItem>(createEmptyBinFileItem())
  const [gameVersion, setGameVersion] = useState<number>(0)
  const [allocatedEntryCount, setAllocatedEntryCount] = useState<number>(0)
  const [positionAndLengths, setPositionAndLengths] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = 'music_data.bin Analyzer - Scene\'s House'
  }, [])

  // Derived state
  const isFileUploaded = items.length > 0

  // Event Handlers
  function initializeFormData(item: BinFileItem) {
    setFormData({
      ...item,
    })
  }

  function processFile(file: File) {
    if (!file.name.endsWith('.bin')) {
      alert(t.toolPages?.binFileAnalyzer?.invalidFileType || 'Please select a .bin file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer
      try {
        const view = new DataView(buffer)
        const gv = view.getUint8(HEAD_VERSION_POS)
        const HEAD_ALLOCATED_ENTRY_POS = gv >= IIDX_VERSION_32 ? 0xc : 0xa
        const allocatedEC = view.getUint32(HEAD_ALLOCATED_ENTRY_POS, true)

        const POSITIONS_AND_LENGTHS = getRelativePosAndLen(gv)
        const parsedItems = parseBinFile(gv, buffer, allocatedEC, POSITIONS_AND_LENGTHS)
        setItems(parsedItems)
        if (parsedItems.length > 0) {
          setSelectedItem(parsedItems[0])
          initializeFormData(parsedItems[0])
        }

        setFileName(file.name)
        setGameVersion(gv)
        setAllocatedEntryCount(allocatedEC)
        setPositionAndLengths(POSITIONS_AND_LENGTHS)
      } catch (err) {
        alert(`Error parsing .bin file: ${err}`)
        setGameVersion(0)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Drag and drop
  const { isDragging, dragHandlers } = useDragAndDrop(processFile)

  const handleItemSelect = (item: BinFileItem) => {
    setSelectedItem(item)
    initializeFormData(item)
  }

  const handleAddItem = () => {
    const newId = prompt('Enter new song ID from 00000-' + (allocatedEntryCount - 1))
    if (newId === null) return
    if (items.map((i) => i.entryId).indexOf(Number(newId)) >= 0) {
      alert('Song ID already used!')
      return
    }
    const newItem: BinFileItem = {
      ...createEmptyBinFileItem(),
      entryId: Number(newId),
      version: Math.floor(Number(newId) / 1000),
    }

    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setSelectedItem(newItem)
    initializeFormData(newItem)
  }

  const handleExportItemsAsJSON = () => {
    const jsonContent = JSON.stringify(items, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    downloadFile(blob, `bin_file_items_${fileName.replace('.bin', '')}.json`)
  }

  const handleImportItemsWithJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string
        const importedItems: BinFileItem[] = JSON.parse(content)
        setItems(importedItems)
        if (importedItems.length > 0) {
          setSelectedItem(importedItems[0])
          initializeFormData(importedItems[0])
        }
        alert('Items imported successfully!')
      } catch (err) {
        alert('Error importing JSON: ' + err)
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteItem = (itemToDelete: BinFileItem) => {
    if (!confirm(`Are you sure you want to delete item ${itemToDelete.entryId}?`)) {
      return
    }
    const updatedItems = items.filter((item) => item.entryId !== itemToDelete.entryId)
    setItems(updatedItems)

    if (selectedItem?.entryId === itemToDelete.entryId) {
      setSelectedItem(null)
      setFormData(createEmptyBinFileItem())
    }
  }

  const handleSubmitUpdate = () => {
    if (!selectedItem) return

    // Update the selected item with form data
    const updatedItems = items.map((item) => {
      if (item.entryId === selectedItem.entryId) {
        return {
          ...formData,
        }
      }
      return item
    })

    setItems(updatedItems)
    setSelectedItem({
      ...formData,
    })

    alert(t.toolPages?.binFileAnalyzer?.updateSuccess || 'Item updated successfully!')
  }

  const handleSaveFile = () => {
    const fileContent = buildBinFileContent(gameVersion, allocatedEntryCount, positionAndLengths, items)
    downloadFile(fileContent, `modified_${fileName}`)
  }

  // Render
  if (!isFileUploaded) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          {t.toolPages?.binFileAnalyzer?.title || 'BIN File Analyzer'}
        </h1>
        <p className="text-muted mb-8">
          {t.toolPages?.binFileAnalyzer?.description || 'Upload and analyze binary (.bin) files'}
        </p>

        <FileUploadZone
          onFileSelect={processFile}
          accept=".bin"
          isDragging={isDragging}
          dragHandlers={dragHandlers}
          uploadPrompt={t.toolPages?.binFileAnalyzer?.uploadPrompt || 'Click to upload .bin file'}
          dropFileHere={t.toolPages?.binFileAnalyzer?.dropFileHere || 'Drop file here'}
          releaseToUpload={t.toolPages?.binFileAnalyzer?.releaseToUpload || 'Release to upload'}
          fileTypeHint={t.toolPages?.binFileAnalyzer?.fileTypeHint || 'Only .bin files are supported'}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            {t.toolPages?.binFileAnalyzer?.title || 'BIN File Analyzer'}
          </h1>
          <p className="text-sm text-muted">
            {t.toolPages?.binFileAnalyzer?.currentFile || 'Current file'}:{' '}
            <span className="font-semibold text-foreground">{fileName}</span> - {'Version'}:{' '}
            <span className="font-semibold text-foreground">{gameVersion}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <FileUploadButton
            onFileSelect={processFile}
            accept=".bin"
            isDragging={isDragging}
            dragHandlers={dragHandlers}
            buttonText={t.toolPages?.binFileAnalyzer?.replaceFile || 'Replace File'}
            dropFileHere={t.toolPages?.binFileAnalyzer?.dropFileHere || 'Drop file here'}
            inputId="replace-file-upload"
          />

          <button onClick={handleSaveFile} className={BUTTON_PRIMARY}>
            {t.toolPages?.binFileAnalyzer?.saveFile || 'Save File'}
          </button>
        </div>
      </div>

      <input
        ref={jsonInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImportItemsWithJSON}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Items List */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground mb-3">
                {t.toolPages?.binFileAnalyzer?.itemsList || 'Items List'}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleAddItem} className={BUTTON_PRIMARY}>
                  {t.toolPages?.binFileAnalyzer?.addItem || 'Add Item'}
                </button>
                <button
                  onClick={() => jsonInputRef.current?.click()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {'Import JSON'}
                </button>
                <button
                  onClick={handleExportItemsAsJSON}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {'Export JSON'}
                </button>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
              {items
                .sort((a, b) => a.entryId - b.entryId)
                .map((item) => (
                  <div
                    key={item.entryId}
                    onClick={() => handleItemSelect(item)}
                    className={`group relative w-full text-left p-3 rounded-lg transition-all cursor-pointer ${
                      selectedItem?.entryId === item.entryId
                        ? 'bg-primary/10 border border-primary/40'
                        : 'bg-surface-hover border border-transparent hover:border-border'
                    }`}
                  >
                    <button onClick={() => handleItemSelect(item)} className="w-full text-left">
                      <div className="font-semibold text-foreground text-sm">
                        {item.entryId} - {decodeHtmlEntity(item.title)}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {t.toolPages?.binFileAnalyzer?.genre || 'Genre'}: {item.genre}
                      </div>
                      <div className="text-xs text-muted/70">
                        {t.toolPages?.binFileAnalyzer?.artist || 'Artist'}: {item.artist}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteItem(item)
                      }}
                      className={`absolute top-2 right-2 ${BUTTON_RED} opacity-0 group-hover:opacity-100`}
                    >
                      {t.toolPages?.binFileAnalyzer?.deleteItem || 'Delete'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Item Details Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">
              {t.toolPages?.binFileAnalyzer?.itemDetails || 'Item Details'}
            </h2>

            <ItemDetailsForm
              selectedItem={selectedItem}
              formData={formData}
              setFormData={setFormData}
              isCompact={gameVersion !== null && gameVersion >= IIDX_VERSION_32}
              onSubmitUpdate={handleSubmitUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
