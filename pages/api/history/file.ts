// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'node:path/posix'
import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const options: Partial<SimpleGitOptions> = {
    baseDir: join(process.cwd(), '_data', 'foo'),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
  }
  console.log(options.baseDir)
  // when setting all options in a single object
  const git: SimpleGit = simpleGit(options)

  type Data = {
    name: string
  }

  res.status(200).json(await git.show('HEAD^:foo.md'))
}
