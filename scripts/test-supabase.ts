import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env da raiz usando process.cwd() para garantir caminho absoluto correto
const envPath = path.resolve(process.cwd(), '.env');
console.log(`📂 Procurando .env em: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("⚠️  Erro ao carregar .env:", result.error.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Erro: Variáveis de ambiente SUPABASE não encontradas.");
    process.exit(1);
}

console.log(`✅ Chaves encontradas.`);
console.log(`URL: ${supabaseUrl}`);
// console.log(`Key: ${supabaseKey.substring(0, 10)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error("❌ Erro ao conectar ao Supabase:", error.message);
            if (error.code === 'PGRST301') { // Token expired or invalid? Unlikely for anon key usually, unless RLS blocks HEAD
                // Ignore RLS for connection test, just check if we reached the server
            }
        } else {
            console.log("✅ Conexão ao Supabase estabelecida com sucesso!");
        }

        // Testar Autenticação (opcional, só se tiver login)
        // const { data: authData, error: authError } = await supabase.auth.getSession();
        // if (authError) console.error("Erro Auth:", authError.message);

    } catch (err) {
        console.error("❌ Erro inesperado:", err);
    }
}

testConnection();
