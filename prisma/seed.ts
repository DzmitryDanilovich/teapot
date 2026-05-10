import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Tea } from '@/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const teas: Tea[] = [
    {
        id: 'e158b290-c4db-4057-97a6-00e00b94193d',
        name: 'Green Tea',
        type: 'Green',
        origin: 'China',
        storeUrl: null,
        createdAt: new Date(),
    },
    {
        id: 'e87613b1-249f-450c-9481-9b58ea5d04e1',
        name: 'Black Tea',
        type: 'Black',
        origin: 'India',
        storeUrl: null,
        createdAt: new Date(),
    },
    {
        id: '750aa0e9-3b86-4ad8-9048-ab223d831e4d',
        name: 'Oolong Tea',
        type: 'Oolong',
        origin: 'Taiwan',
        storeUrl: null,
        createdAt: new Date(),
    },
];

const seedTea = async (tea: Tea): Promise<Tea> =>  await prisma.tea.upsert({
        where: { id: tea.id },
        update: {},
        create: tea,
    });

const main = async () => {
    const results = await Promise.all(teas.map(seedTea));

    console.log(results);
};


main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
