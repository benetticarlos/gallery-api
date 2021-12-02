export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export type AsyncFunc = (...args: any[]) => Promise<any>
export const asyncMap = async (promises: AsyncFunc[], func: AsyncFunc) =>
  await Promise.all(promises.map((item, index, ary) => func(item)))

export const paginatedQuery = (query: any[]) => {
  const pages = []
  for (let index = 0; index < query.length / 12; index++) {
    pages[index] = query.slice(index * 12, index * 12 + 12)
  }
  return pages
}

const toCamel = (s: string): string => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

const isArray = (a: any) => {
  return Array.isArray(a)
}

const isObject = (o: any) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function'
}

export const keysToCamel = (o: any) => {
  if (isObject(o)) {
    const n: { [key: string]: any } = {}

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k])
    })

    return n
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i)
    })
  }

  return o
}

export const isImage = (file: any) => {
  const { mimetype } = file
  const imagesTypes = [
    'image/bmp',
    'image/x-bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/tiff',
  ]
  return imagesTypes.includes(mimetype)
}

export const isImageURL = (fileURL: string) => {
  const match = fileURL.match(/(\.\w+$)/)
  if (!match) return false

  const extension = match[0]
  const imagesExt = ['.bmp', '.x-bmp', '.gif', '.jpeg', '.jpg', '.png', '.tiff']
  return imagesExt.includes(extension)
}

export const getExtensionFromMime = (mime: string) => {
  const extMimeMap: { [key: string]: string } = {
    'image/bmp': '.bmp',
    'image/x-bmp': '.x-bmp',
    'image/gif': '.gif',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/tiff': '.tiff',
  }
  return extMimeMap[mime]
}
