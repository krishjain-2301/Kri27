import { searchVault } from '../src/actions/search';

async function test() {
  console.log("Testing searchVault('Spooky')...");
  const res = await searchVault('Spooky');
  console.log(res);
}
test();
