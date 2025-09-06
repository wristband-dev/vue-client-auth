import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'

// Custom plugin to preserve environment checks
function preserveConditionals() {
  return {
    name: 'preserve-conditionals',
    transform(code) {
      // Check if the code contains conditionals we want to preserve
      if (code.includes('typeof window')) {
        // Mark the code as having side effects to prevent tree-shaking
        return {
          code: `/* This module has browser conditionals that must be preserved */
${code}`,
          map: null,
        }
      }
      return null
    },
  }
}

export default defineConfig([
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
    },
    external: ['vue', 'vue-router'],
    plugins: [
      preserveConditionals(),
      nodeResolve(),
      typescript({
        tsconfig: './config/tsconfig.esm.json',
        declaration: true,
      }),
    ],
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
    },
    external: ['vue', 'vue-router'],
    plugins: [
      preserveConditionals(),
      nodeResolve(),
      typescript({
        tsconfig: './config/tsconfig.cjs.json',
        declaration: true,
        // This overrides the tsconfig module setting for Rollup's processing
        module: 'esnext',
      }),
    ],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',
      format: 'esm',
    },
    plugins: [dts()],
  },
])
