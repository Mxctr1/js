import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x30a63e11" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "claimCondition",
    components: [
      {
        type: "uint256",
        name: "availableSupply",
      },
      {
        type: "bytes32",
        name: "allowlistMerkleRoot",
      },
      {
        type: "uint256",
        name: "pricePerUnit",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint48",
        name: "startTimestamp",
      },
      {
        type: "uint48",
        name: "endTimestamp",
      },
      {
        type: "string",
        name: "auxData",
      },
    ],
  },
] as const;

/**
 * Checks if the `getClaimCondition` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getClaimCondition` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetClaimConditionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetClaimConditionSupported(contract);
 * ```
 */
export async function isGetClaimConditionSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getClaimCondition function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetClaimConditionResult } from "thirdweb/extensions/modular";
 * const result = decodeGetClaimConditionResult("...");
 * ```
 */
export function decodeGetClaimConditionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimCondition" function on the contract.
 * @param options - The options for the getClaimCondition function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getClaimCondition } from "thirdweb/extensions/modular";
 *
 * const result = await getClaimCondition({
 *  contract,
 * });
 *
 * ```
 */
export async function getClaimCondition(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
