import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";

//Defiine a schema for input validation

const userSchema = z.object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })

export async function POST (req: Request) {
    try {
        const body = await req.json();
        const {email, username, password} = userSchema.parse(body);

        const existingUserByEmail = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUserByEmail) {
            return NextResponse.json ({ user:null, message: "User with this email already exists"}, {status: 409});
        }   

        const existingUserByUsername = await db.user.findUnique({
            where: {
                username: username,
            },
        });

        if (existingUserByUsername) {
            return NextResponse.json ({ user:null, message: "User with this username already exists"}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });
        // Omit the password from the response for security reasons 
        const {password: newUserPassword, ...rest} = newUser;
        // Return the user and a success message 
        return NextResponse.json({user: rest, message: "User created successfully"}, {status: 201});
}

catch (error) {
    return NextResponse.json({ message: 'An error occurred while creating the user', error: error.message }, { status: 500 });

}
}

