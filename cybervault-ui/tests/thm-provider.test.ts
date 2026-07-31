import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { THMProfileSchema, THMCompletedRoomsSchema } from '../src/lib/providers/thm/types';
import { THMMapper } from '../src/lib/providers/thm/mapper';

const loadFixture = (filename: string) => {
  const p = path.join(__dirname, 'fixtures', filename);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};

describe('TryHackMe Provider Data Pipeline Regression Tests', () => {

  it('should map THM user profile correctly from fixture', () => {
    const rawJson = loadFixture('thm-profile.json');
    const validatedData = THMProfileSchema.parse(rawJson);
    assert.strictEqual(validatedData.username, 'demo_user');
    
    const userProfile = THMMapper.toUserProfile(validatedData);
    assert.strictEqual(userProfile.username, 'demo_user');
    assert.strictEqual(userProfile.rank, 'Rank #4215');
    assert.strictEqual(userProfile.points, 1250);
  });

  it('should map THM completed rooms correctly from fixture', () => {
    const rawJson = loadFixture('thm-completed-rooms.json');
    const validatedData = THMCompletedRoomsSchema.parse(rawJson);
    assert.strictEqual(validatedData.length, 3);
    
    const vaultItems = THMMapper.toVaultItems(validatedData);
    assert.strictEqual(vaultItems.length, 3);
    
    const pickleRick = vaultItems.find(i => i.name === 'Pickle Rick');
    assert.ok(pickleRick);
    assert.strictEqual(pickleRick.providerId, 'thm_room_picklerick');
    assert.strictEqual(pickleRick.type, 'Machine');
    assert.strictEqual(pickleRick.difficulty, 'Easy');
    assert.strictEqual(pickleRick.provider, 'THM');
    
    const introRoom = vaultItems.find(i => i.name === 'Intro to Cyber Security');
    assert.ok(introRoom);
    assert.strictEqual(introRoom.type, 'Academy');
    assert.strictEqual(introRoom.difficulty, 'Info');
  });

  it('should handle empty rooms gracefully', () => {
    const vaultItems = THMMapper.toVaultItems([]);
    assert.strictEqual(vaultItems.length, 0);
  });
});
