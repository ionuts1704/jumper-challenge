import * as z from 'zod';
import 'dotenv/config';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    PROJECT_ID: z.string(),
  });

  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
