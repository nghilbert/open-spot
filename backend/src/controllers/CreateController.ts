import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';


export class CreateAccountController {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }



  async register(req: Request, res: Response): Promise<void> {
    const {email, password} = req.body;
    

    // Basic validation
    if (!email || !password) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
   
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }


    // Hash password
    // Creates the password hash to insert to the DB
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        email:email,
        passwordHash: passwordHash,
        name: ""
      }
    });

    res.status(201).json({ message: 'Account created successfully.' });
  }
}