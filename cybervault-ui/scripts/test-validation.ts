import { db } from '../src/lib/db/client';
import { settings } from '../src/lib/db/schema';
import { HackTheBoxProvider } from '../src/lib/providers/htb/provider';

async function testValidation() {
  const userSettings = await db.select().from(settings).limit(1);
  if (userSettings.length === 0 || !userSettings[0].htbAppToken) {
    console.log("No token found");
    return;
  }
  const provider = new HackTheBoxProvider(userSettings[0].htbAppToken);
  console.log("Validating connection...");
  const res = await provider.validateConnection();
  console.log("Result:", res);
}

testValidation().catch(console.error);
