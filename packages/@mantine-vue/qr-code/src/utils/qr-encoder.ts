import QRCodeLibrary from 'qrcode'
import type { QRCodeErrorCorrectionLevel } from '../QRCode.types'

export interface QRMatrix {
  /** Two-dimensional matrix where true represents a dark module. */
  modules: boolean[][]
  /** Number of modules on each side. */
  size: number
}

export function generateQRMatrix(
  value: string,
  errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'M',
): QRMatrix {
  const qr = QRCodeLibrary.create(value, { errorCorrectionLevel })
  const size = qr.modules.size
  const matrix: boolean[][] = []

  for (let row = 0; row < size; row += 1) {
    const rowData: boolean[] = []
    for (let column = 0; column < size; column += 1) {
      rowData.push(qr.modules.data[row * size + column] === 1)
    }
    matrix.push(rowData)
  }

  return { modules: matrix, size }
}

export function isFinderPattern(row: number, column: number, matrixSize: number): boolean {
  return (
    (row < 7 && column < 7) ||
    (row < 7 && column >= matrixSize - 7) ||
    (row >= matrixSize - 7 && column < 7)
  )
}
