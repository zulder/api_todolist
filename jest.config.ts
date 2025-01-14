// jest.config.ts

import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest", // Usar o preset do ts-jest
  testEnvironment: "node", // Definir o ambiente de testes como 'node'
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transforma arquivos TypeScript
  },
  moduleFileExtensions: ["ts", "js", "json", "node"], // Extensões de arquivo suportadas
  rootDir: ".", // Define a raiz do código da aplicação
  testRegex: ".*\\.(spec|test)\\.ts$", // Arquivos de teste com extensão `.spec.ts`
  coverageDirectory: "./coverage", // Diretório para armazenar relatórios de cobertura
  collectCoverageFrom: [
    "src/**/*.{ts,js}", // Coletar a cobertura de todos os arquivos da pasta src
    "!src/**/*.d.ts", // Ignorar arquivos de declaração
  ],
};

export default config;
