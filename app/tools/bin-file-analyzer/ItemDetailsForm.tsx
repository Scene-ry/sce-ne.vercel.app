import { useLanguage } from '@/contexts/LanguageContext'
import { INPUT_CLASSES, INPUT_CLASSES_DISABLED, BUTTON_GREEN } from '../shared/commonStyles'
import BinFileItem from './BinFileItem'

interface ItemDetailsFormProps {
  selectedItem: BinFileItem | null
  formData: BinFileItem
  setFormData: React.Dispatch<React.SetStateAction<BinFileItem>>
  isCompact?: boolean
  onSubmitUpdate: () => void
}

export default function ItemDetailsForm({
  selectedItem,
  formData,
  setFormData,
  isCompact = true,
  onSubmitUpdate,
}: ItemDetailsFormProps) {
  const { t } = useLanguage()

  const onFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onNestedChange = (section: keyof BinFileItem, key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as Record<string, unknown>) || {}),
        [key]: value,
      },
    }))
  }

  const onDeepChange = (section: keyof BinFileItem, sub: string, key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as Record<string, unknown>) || {}),
        [sub]: {
          ...(((prev[section] as Record<string, unknown>) || {})[sub] || {}),
          [key]: value,
        },
      },
    }))
  }

  if (!selectedItem) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {t.toolPages?.binFileAnalyzer?.selectItem || 'Select an item from the list to view details'}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Title, ASCII Title, Genre Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onFormChange('title', e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ASCII Title</label>
          <input
            type="text"
            value={formData.asciiTitle || ''}
            onChange={(e) => onFormChange('asciiTitle', e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Genre</label>
          <input
            type="text"
            value={formData.genre || ''}
            onChange={(e) => onFormChange('genre', e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Artist</label>
          <input
            type="text"
            value={formData.artist || ''}
            onChange={(e) => onFormChange('artist', e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      {/* Artist, License/License, Entry ID/Version Row */}
      {isCompact && (
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">License</label>
            <input
              type="text"
              value={formData.license || ''}
              onChange={(e) => onFormChange('license', e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>
        </div>
      )}

      {/* AFP Flag, Volume, Entry Font Row */}
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Entry ID</label>
            <input type="number" value={formData.entryId ?? 0} disabled className={INPUT_CLASSES_DISABLED} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Version</label>
            <input
              type="number"
              value={formData.version ?? 0}
              onChange={(e) => onFormChange('version', parseInt(e.target.value || '0'))}
              className={INPUT_CLASSES}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Afp Flag</label>
            <input
              type="number"
              value={formData.afpFlag ?? 0}
              onChange={(e) => onFormChange('afpFlag', parseInt(e.target.value || '0'))}
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Volume</label>
            <input
              type="number"
              value={formData.volume ?? 0}
              onChange={(e) => onFormChange('volume', parseInt(e.target.value || '0'))}
              className={INPUT_CLASSES}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Entry Font</label>
          <select
            value={formData.entryFont ?? 0}
            onChange={(e) => onFormChange('entryFont', parseInt(e.target.value || '0'))}
            className={INPUT_CLASSES}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>

      {/* Difficulties & File Identifiers */}
      <div className="grid md:grid-cols-2 gap-2">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Difficulties (SP / DP)</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm font-medium mb-1">SP - Beginner</div>
              <input
                type="number"
                value={formData.difficulties?.sp?.beginner ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'sp', 'beginner', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">DP - Beginner</div>
              <input
                type="number"
                value={formData.difficulties?.dp?.beginner ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'dp', 'beginner', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">SP - Normal</div>
              <input
                type="number"
                value={formData.difficulties?.sp?.normal ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'sp', 'normal', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">DP - Normal</div>
              <input
                type="number"
                value={formData.difficulties?.dp?.normal ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'dp', 'normal', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">SP - Hyper</div>
              <input
                type="number"
                value={formData.difficulties?.sp?.hyper ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'sp', 'hyper', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">DP - Hyper</div>
              <input
                type="number"
                value={formData.difficulties?.dp?.hyper ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'dp', 'hyper', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">SP - Another</div>
              <input
                type="number"
                value={formData.difficulties?.sp?.another ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'sp', 'another', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">DP - Another</div>
              <input
                type="number"
                value={formData.difficulties?.dp?.another ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'dp', 'another', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">SP - Leggendaria</div>
              <input
                type="number"
                value={formData.difficulties?.sp?.leggendaria ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'sp', 'leggendaria', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">DP - Leggendaria</div>
              <input
                type="number"
                value={formData.difficulties?.dp?.leggendaria ?? 0}
                onChange={(e) => onDeepChange('difficulties', 'dp', 'leggendaria', parseInt(e.target.value || '0'))}
                className={INPUT_CLASSES}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">File Identifiers</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium mb-1">SP - Beginner</div>
                <input
                  value={formData.fileIdentifiers?.sp?.beginner || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'sp', 'beginner', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">DP - Beginner</div>
                <input
                  value={formData.fileIdentifiers?.dp?.beginner || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'dp', 'beginner', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium mb-1">SP - Normal</div>
                <input
                  value={formData.fileIdentifiers?.sp?.normal || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'sp', 'normal', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">DP - Normal</div>
                <input
                  value={formData.fileIdentifiers?.dp?.normal || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'dp', 'normal', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium mb-1">SP - Hyper</div>
                <input
                  value={formData.fileIdentifiers?.sp?.hyper || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'sp', 'hyper', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">DP - Hyper</div>
                <input
                  value={formData.fileIdentifiers?.dp?.hyper || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'dp', 'hyper', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium mb-1">SP - Another</div>
                <input
                  value={formData.fileIdentifiers?.sp?.another || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'sp', 'another', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">DP - Another</div>
                <input
                  value={formData.fileIdentifiers?.dp?.another || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'dp', 'another', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium mb-1">SP - Leggendaria</div>
                <input
                  value={formData.fileIdentifiers?.sp?.leggendaria || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'sp', 'leggendaria', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">DP - Leggendaria</div>
                <input
                  value={formData.fileIdentifiers?.dp?.leggendaria || ''}
                  onChange={(e) => onDeepChange('fileIdentifiers', 'dp', 'leggendaria', e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Texture Flags & BGA Filename */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <h3 className="font-semibold mb-2">Entry Texture Flags</h3>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.entryTextureFlags?.title}
                onChange={(e) => onNestedChange('entryTextureFlags', 'title', e.target.checked)}
              />{' '}
              <span className="text-sm">Title</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.entryTextureFlags?.artist}
                onChange={(e) => onNestedChange('entryTextureFlags', 'artist', e.target.checked)}
              />{' '}
              <span className="text-sm">Artist</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.entryTextureFlags?.genre}
                onChange={(e) => onNestedChange('entryTextureFlags', 'genre', e.target.checked)}
              />{' '}
              <span className="text-sm">Genre</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.entryTextureFlags?.load}
                onChange={(e) => onNestedChange('entryTextureFlags', 'load', e.target.checked)}
              />{' '}
              <span className="text-sm">Load</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.entryTextureFlags?.list}
                onChange={(e) => onNestedChange('entryTextureFlags', 'list', e.target.checked)}
              />{' '}
              <span className="text-sm">List</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">BGA Filename / Delay</h3>
          <div className="flex gap-2">
            <input
              value={formData.bgaFileName || ''}
              onChange={(e) => onFormChange('bgaFileName', e.target.value)}
              className="w-1/2 p-2 rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="number"
              value={formData.bgaDelay ?? 0}
              onChange={(e) => onFormChange('bgaDelay', parseInt(e.target.value || '0'))}
              className="w-1/2 p-2 rounded border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Entry Flags */}
      <div>
        <h3 className="font-semibold mb-2">Entry Flags</h3>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.otherFolder}
              onChange={(e) => onFormChange('otherFolder', e.target.checked)}
            />
            <span className="text-sm">Other Folder</span>
          </label>
          {isCompact && (
            <>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData.beginnerRecommend}
                  onChange={(e) => onFormChange('beginnerRecommend', e.target.checked)}
                />
                <span className="text-sm">Beginner Recommend</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData.iidxRecommend}
                  onChange={(e) => onFormChange('iidxRecommend', e.target.checked)}
                />
                <span className="text-sm">IIDX Recommend</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData.bemaniSeriesRecommend}
                  onChange={(e) => onFormChange('bemaniSeriesRecommend', e.target.checked)}
                />
                <span className="text-sm">BEMANI Series Recommend</span>
              </label>
            </>
          )}
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.bemaniFolder}
              onChange={(e) => onFormChange('bemaniFolder', e.target.checked)}
            />
            <span className="text-sm">BEMANI Folder</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.splittableDiff}
              onChange={(e) => onFormChange('splittableDiff', e.target.checked)}
            />
            <span className="text-sm">Splittable Diff.</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button onClick={onSubmitUpdate} className={`w-full md:w-auto ${BUTTON_GREEN}`}>
          {t.toolPages?.binFileAnalyzer?.updateItem || 'Update Item'}
        </button>
      </div>
    </div>
  )
}
