import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import prisma from '../client';
import { Context, createMockContext, MockContext } from "./context";

// mock the client 
jest.mock("./client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}));

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>


