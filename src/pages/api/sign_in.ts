// 'use server';

// import { signIn } from "@/auth";
// import type { NextApiRequest, NextApiResponse } from "next";

// type ResponseData = {
// 	message: string;
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
// 	// if (req.method !== 'POST') {
// 	//     res.setHeader('Allow', ['POST']);
// 	//     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
// 	// }

// 	await signIn("github");

// 	res.status(200).json({ message: "Hello from Next.js!" });
// }
