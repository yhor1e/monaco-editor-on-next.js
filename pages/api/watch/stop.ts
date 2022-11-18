// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'node:path/posix'
import { watcherInstances } from './state'
import chokidar from 'chokidar'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  console.log('watch/stop')
  const targetDir = join(process.cwd(), '_data', 'foo')
  const existedWatcher = watcherInstances.get(targetDir)
  if (existedWatcher === undefined)
    return res.status(200).json('no watcher exists')
  try {
    await existedWatcher.close()
    watcherInstances.delete(targetDir)
    console.log('closed')
  } catch (error) {
    console.error(error)
  }
  res.status(200).json('stop')
}
