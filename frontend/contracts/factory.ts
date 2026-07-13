import { Contract, ContractRunner, InterfaceAbi } from "ethers";

interface GetContractParams {
  address: string;
  abi: InterfaceAbi;
  runner: ContractRunner;
}

export function getContract({
  address,
  abi,
  runner,
}: GetContractParams) {
  return new Contract(address, abi, runner);
}