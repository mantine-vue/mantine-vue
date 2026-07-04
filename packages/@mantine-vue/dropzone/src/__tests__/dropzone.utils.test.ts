import { describe, expect, it, vi } from 'vitest'
import {
  acceptPropAsAcceptAttr,
  allFilesAccepted,
  ErrorCode,
  fileAccepted,
  fileMatchSize,
  isExt,
  isMIMEType,
  pickerOptionsFromAccept,
  TOO_MANY_FILES_REJECTION,
} from '../utils'

function makeFile(name: string, type: string, size: number): File {
  const file = new File(['x'.repeat(size)], name, { type })
  return file
}

describe('@mantine-vue/dropzone utils', () => {
  describe('fileAccepted', () => {
    it('accepts any file when no accept string is provided', () => {
      const [accepted] = fileAccepted(makeFile('a.png', 'image/png', 10), undefined)
      expect(accepted).toBe(true)
    })

    it('accepts a file matching an exact mime type', () => {
      const [accepted] = fileAccepted(makeFile('a.png', 'image/png', 10), 'image/png')
      expect(accepted).toBe(true)
    })

    it('accepts a file matching a wildcard mime type', () => {
      const [accepted] = fileAccepted(makeFile('a.png', 'image/png', 10), 'image/*')
      expect(accepted).toBe(true)
    })

    it('accepts a file matching a file extension', () => {
      const [accepted] = fileAccepted(makeFile('a.csv', 'text/csv', 10), '.csv')
      expect(accepted).toBe(true)
    })

    it('rejects a file that does not match accept and reports an invalid type error', () => {
      const [accepted, error] = fileAccepted(makeFile('a.pdf', 'application/pdf', 10), 'image/*')
      expect(accepted).toBe(false)
      expect(error?.code).toBe(ErrorCode.FileInvalidType)
    })
  })

  describe('fileMatchSize', () => {
    it('rejects files larger than maxSize', () => {
      const [ok, error] = fileMatchSize(makeFile('a.png', 'image/png', 100), undefined, 50)
      expect(ok).toBe(false)
      expect(error?.code).toBe(ErrorCode.FileTooLarge)
    })

    it('rejects files smaller than minSize', () => {
      const [ok, error] = fileMatchSize(makeFile('a.png', 'image/png', 10), 50, undefined)
      expect(ok).toBe(false)
      expect(error?.code).toBe(ErrorCode.FileTooSmall)
    })

    it('accepts files within the size range', () => {
      const [ok] = fileMatchSize(makeFile('a.png', 'image/png', 30), 10, 50)
      expect(ok).toBe(true)
    })
  })

  describe('allFilesAccepted', () => {
    it('rejects everything when multiple is false and more than one file is provided', () => {
      const files = [makeFile('a.png', 'image/png', 10), makeFile('b.png', 'image/png', 10)]
      expect(allFilesAccepted({ files, multiple: false })).toBe(false)
    })

    it('rejects everything when maxFiles is exceeded', () => {
      const files = [
        makeFile('a.png', 'image/png', 10),
        makeFile('b.png', 'image/png', 10),
        makeFile('c.png', 'image/png', 10),
      ]
      expect(allFilesAccepted({ files, multiple: true, maxFiles: 2 })).toBe(false)
    })

    it('accepts files that all pass accept/size/validator checks', () => {
      const files = [makeFile('a.png', 'image/png', 10)]
      expect(allFilesAccepted({ files, multiple: true, accept: 'image/*', maxSize: 100 })).toBe(
        true,
      )
    })

    it('rejects when a custom validator returns an error', () => {
      const files = [makeFile('a.png', 'image/png', 10)]
      const validator = vi.fn().mockReturnValue({ code: 'custom', message: 'nope' })
      expect(allFilesAccepted({ files, multiple: true, validator })).toBe(false)
      expect(validator).toHaveBeenCalledWith(files[0])
    })
  })

  describe('acceptPropAsAcceptAttr / pickerOptionsFromAccept', () => {
    it('flattens an Accept record into a comma-separated attr string', () => {
      const attr = acceptPropAsAcceptAttr({
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
      })
      expect(attr).toBe('image/png,.png,image/jpeg,.jpg,.jpeg')
    })

    it('returns undefined when accept is not provided', () => {
      expect(acceptPropAsAcceptAttr(undefined)).toBeUndefined()
      expect(pickerOptionsFromAccept(undefined)).toBeUndefined()
    })

    it('builds showOpenFilePicker options from an Accept record', () => {
      const options = pickerOptionsFromAccept({ 'image/png': ['.png'] })
      expect(options).toEqual([{ description: 'Files', accept: { 'image/png': ['.png'] } }])
    })
  })

  describe('isMIMEType / isExt', () => {
    it('recognizes common mime type patterns', () => {
      expect(isMIMEType('image/*')).toBe(true)
      expect(isMIMEType('application/pdf')).toBe(true)
      expect(isMIMEType('not-a-mime-type')).toBe(false)
    })

    it('recognizes file extension patterns', () => {
      expect(isExt('.png')).toBe(true)
      expect(isExt('png')).toBe(false)
    })
  })

  it('exposes a stable too-many-files rejection reason', () => {
    expect(TOO_MANY_FILES_REJECTION.code).toBe(ErrorCode.TooManyFiles)
  })
})
