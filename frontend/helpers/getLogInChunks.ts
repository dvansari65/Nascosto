import { ethers } from "ethers";

const MAX_BLOCK_RANGE = 2048; // Fuji public RPC's per-request eth_getLogs limit

export async function getLogsInChunks(
  contract: ethers.Contract,
  filter: ethers.DeferredTopicFilter,
  fromBlock: number,
  provider: ethers.Provider,
): Promise<ethers.EventLog[]> {
  const latestBlock = await provider.getBlockNumber();
  const allEvents: ethers.EventLog[] = [];

  for (let start = fromBlock; start <= latestBlock; start += MAX_BLOCK_RANGE) {
    const end = Math.min(start + MAX_BLOCK_RANGE - 1, latestBlock);
    const events = await contract.queryFilter(filter, start, end);
    allEvents.push(...(events as ethers.EventLog[]));
  }

  return allEvents;
}
