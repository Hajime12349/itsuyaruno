import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Next.js アプリのルートディレクトリを指定
  dir: './',
})

// Jest のカスタム設定
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // テスト実行前に実行するセットアップファイル
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // パスエイリアスの設定（tsconfig.json の @/* と合わせる）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)