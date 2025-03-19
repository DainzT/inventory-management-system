import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const supabaseUrl = process.env.DATABASE_URL!;
const supabaseKey = process.env.DATABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors());
app.use(express.json());
