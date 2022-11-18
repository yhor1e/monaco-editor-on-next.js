// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'node:path/posix'
import { watcherInstances } from './state'
import chokidar from 'chokidar'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  console.log('watch/start')
  const targetDir = join(process.cwd(), '_data', 'foo')
  const existedWatcher = watcherInstances.get(targetDir)
  if (existedWatcher !== undefined)
    return res.status(200).json('already started')

  const watcher = chokidar
    .watch(targetDir, {
      ignored: '**/.git/**',
      interval: 1000,
      awaitWriteFinish: { pollInterval: 1000 },
    })
    .on('all', (event, path) => {
      console.log('chokidar: ', event, path)
    })
  watcherInstances.set(targetDir, watcher)
  res.status(200).json('start')
}
