import { db } from '../src/lib/db/client';
import { settings, htbItems } from '../src/lib/db/schema';
import { HTBClient } from '../src/lib/providers/htb/client';
import { HTBMapper } from '../src/lib/providers/htb/mapper';

async function testSync() {
  console.log("=== TRACING SYNC PIPELINE ===");
  
  const userSettings = await db.select().from(settings).limit(1);
  if (!userSettings.length || !userSettings[0].htbAppToken) {
    console.error("No HTB token found in DB.");
    return;
  }
  
  const token = userSettings[0].htbAppToken;
  const client = new HTBClient(token);
  
  console.log("\n[1] FETCHING USER INFO");
  let userId;
  try {
    const userInfo = await client.getUserInfo();
    userId = (userInfo as any).info.id;
    console.log("User ID:", userId);
  } catch (e) {
    console.error("Failed to get user info:", e);
    return;
  }

  console.log("\n[2] FETCHING MACHINES");
  try {
    const response = await fetch(`https://labs.hackthebox.com/api/v4/user/profile/machine/owns/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Raw JSON Sample:", text.substring(0, 500) + "...");
  } catch (e) {
    console.error("Error fetching machines:", e);
  }

  console.log("\n[3] FETCHING CHALLENGES");
  try {
    const response = await fetch(`https://labs.hackthebox.com/api/v4/user/profile/challenge/owns/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Raw JSON Sample:", text.substring(0, 500) + "...");
  } catch (e) {
    console.error("Error fetching challenges:", e);
  }
}

testSync().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
