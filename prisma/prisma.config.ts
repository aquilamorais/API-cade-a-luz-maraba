import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { Pool } from 'pg'
import path from 'path'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
  migrations: {
    path: path.join(__dirname, 'migrations'),
  },
  datasource: {
    url: process.env.DIRECT_URL!
  },
  migrate: {
    adapter: async () => {
      return new Pool({ connectionString: process.env.DIRECT_URL })
    }
  }
})
