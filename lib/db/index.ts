import { drizzle } from 'drizzle-orm/neon-http';
import {neon} from "@neondatabase/serverless"

import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, {schema}) // connection via drizzle

export {sql} // raw sql queries connected with neon, used when we want to use raw queries