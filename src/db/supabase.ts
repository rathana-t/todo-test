import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uwpnsbzczgmhcnzuwijh.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY ?? ""
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cG5zYnpjemdtaGNuenV3aWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NzU3MDMsImV4cCI6MjAzMzE1MTcwM30.ohyrepNjj88Uw6fR8Vx3DD2xVBrmGROX5gUcxKUdNts";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
