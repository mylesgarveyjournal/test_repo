// Simple data provider abstraction. Currently reads from local JSON files.
// Swap this module with a network-backed implementation for AWS/GCP later.
import strains from '../data/strains.json';

export async function getStrains() {
  // simulate async I/O
  return new Promise(resolve => setTimeout(() => resolve(strains), 80));
}

export default { getStrains };
