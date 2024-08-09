import sourceMap from 'source-map-js'
import type { IFileInfo } from '@/interface/index'

// 匹配文件
export const matchFile = (filename: string) => {
  console.log(filename, '<===filename')

  if (filename.endsWith('.js')) return filename.substring(filename.lastIndexOf('/') + 1)
}

// 获取到对应的map文件
export const loadSourceMap = async (filename: string) => {
  console.log(filename, '<===filename111')
  const file = matchFile(filename)
  console.log(file, '<===file sourceMap')
  if (!file) return
  // return ((await fetch(`http://localhost:3000/getSourceMap?fileName=${file}`)))
  return new Promise((resolve) => {
    fetch(`http://localhost:3000/getSourceMap?fileName=${file}.map`).then((response) => {
      resolve(response.json())
    })
  })
}

export const findCodeBySourceMap = async (
  fileInfo: IFileInfo
): Promise<{
  code: string[]
  line: number
}> => {
  console.log(fileInfo, '<===fileInfo')
  const { fileName, line, column } = fileInfo
  const sourceData = await loadSourceMap(fileName)
  console.log(sourceData, '<====file res')
  if (!sourceData) return
  // sourcesData 是sourcemap文件的json数据
  const { sourcesContent, sources } = sourceData
  // console.log();
  

  const consumer = await new sourceMap.SourceMapConsumer(sourceData)
  console.log(consumer, '<===consumer');
  
  const result = consumer.originalPositionFor({ line, column })
  console.log(result, '<====result.sources')
  // result 是sourcemap文件中对应的源文件信息，包括源文件名、源文件行号、源文件列号等
  let index = sources.indexOf(result.source)
  if (index === -1) {
    let copySources = JSON.parse(JSON.stringify(sources)).map((item) => item.replace(/\/.\//g, '/'))
    index = copySources.indexOf(result.source)
  }
  console.log('index', index)
  let code = sourcesContent[index]
  let codeList = code.split('\n')
  console.log(code, '<===code')
  console.log(codeList, '<===codeList')
  return {
    code: codeList.slice(result.line - 5, result.line + 5),
    line: result.line
  }
}
