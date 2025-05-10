import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {  
 
 
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
