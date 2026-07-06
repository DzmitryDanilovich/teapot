export const seedUserStorageStatePath = 'e2e/.auth/user.json';

export const SEED_USER: { name: string; email: string; password: string } = {
    name: 'Test User',
    email: 'test@test.test',
    password: 'Str0ngP@ssw0rd!',
};

export const LOGGED_OUT_USER: {
    name: string;
    email: string;
    password: string;
} = {
    name: 'Logged Out User',
    email: 'test2@test.test',
    password: 'Str0ngP@ssw0rd!',
};
