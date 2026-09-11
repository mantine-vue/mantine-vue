/** Builds a mask identifying modules hidden by the center image and its padding. */
export function getExcavationMask(
  matrixSize: number,
  imageModuleSize: number,
  imagePadding: number,
): boolean[][] {
  const mask = Array.from({ length: matrixSize }, () => Array<boolean>(matrixSize).fill(false))
  const totalImageModules = imageModuleSize + imagePadding * 2
  const startModule = Math.floor((matrixSize - totalImageModules) / 2)
  const endModule = startModule + totalImageModules

  for (let row = 0; row < matrixSize; row += 1) {
    for (let column = 0; column < matrixSize; column += 1) {
      if (row >= startModule && row < endModule && column >= startModule && column < endModule) {
        mask[row][column] = true
      }
    }
  }

  return mask
}
