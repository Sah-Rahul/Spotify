import { neon } from "@neondatabase/serverless"

import dotenv from "dotenv"
dotenv.config()

export const NEONDB = neon(process.env.NEON_DB_URL as string)