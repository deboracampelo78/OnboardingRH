import dotenv from 'dotenv';
import { createApp } from './app';
import { connectToDatabase } from './config/db';

dotenv.config();

const PORT = process.env.PORT ?? 3001;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/onboarding-rh';
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

async function main() {
  await connectToDatabase(MONGODB_URI);

  const app = createApp(CORS_ORIGIN);
  app.listen(PORT, () => {
    console.log(`Onboarding API rodando na porta ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Falha ao iniciar o servidor', err);
  process.exit(1);
});
