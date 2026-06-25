import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { HTBUserResponseSchema, HTBItemsListSchema } from '../src/lib/providers/htb/types';
import { HTBMapper } from '../src/lib/providers/htb/mapper';

const loadFixture = (filename: string) => {
  const p = path.join(__dirname, 'fixtures', filename);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};

describe('HTB Provider Data Pipeline Regression Tests', () => {
  
  it('should map user profile correctly from raw HAR fixture', () => {
    // 1. Raw HTB JSON
    const rawJson = loadFixture('profile.json');
    
    // 2. Zod Validation
    const validatedData = HTBUserResponseSchema.parse(rawJson);
    assert.strictEqual(validatedData.profile.id, 2228099);
    
    // 3. Mapper
    const cyberVaultItem = HTBMapper.toUserProfile(validatedData);
    
    // 4. Snapshot / Verify
    assert.strictEqual(cyberVaultItem.username, 'krishjain213');
    assert.strictEqual(cyberVaultItem.rank, 'Noob');
    assert.strictEqual(cyberVaultItem.points, 0);
  });

  it('should map challenge owns correctly from raw HAR fixture', () => {
    // 1. Raw HTB JSON
    const rawJson = loadFixture('challenges-list.json');
    
    // 2. Zod Validation
    const validatedData = HTBItemsListSchema.parse(rawJson);
    
    // 3. Mapper
    const cyberVaultItems = HTBMapper.toChallengeItems(validatedData);
    
    // 4. Snapshot / Verify
    // The HAR fixture contains 15 challenges, but only 2 have is_owned: true
    assert.strictEqual(cyberVaultItems.length, 2);
    
    const ownedNames = cyberVaultItems.map(c => c.name).sort();
    assert.deepStrictEqual(ownedNames, ['Flag Command', 'SpookyPass']);
    assert.strictEqual(cyberVaultItems[0].status, 'Completed');
    assert.strictEqual(cyberVaultItems[0].type, 'Challenge');
  });

  it('should not break on unowned items', () => {
    const rawJson = {
      data: [
        { id: 1, name: 'Not Owned', difficulty: 'Hard', is_owned: false }
      ]
    };
    
    const validatedData = HTBItemsListSchema.parse(rawJson);
    const cyberVaultItems = HTBMapper.toChallengeItems(validatedData);
    
    // Should map strictly 0 items because is_owned is false
    assert.strictEqual(cyberVaultItems.length, 0);
  });
});
