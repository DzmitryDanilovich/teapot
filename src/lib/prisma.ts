import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient; 
}; 

const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, 
});

const adapter = new PrismaPg(pgPool);

const prisma =
    globalForPrisma.prisma
    || new PrismaClient({
        adapter, 
    }); 

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma; 
}

export default prisma;
