import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x3e429396" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    components: [
      {
        type: "address",
        name: "implementation",
      },
      {
        type: "tuple",
        name: "config",
        components: [
          {
            type: "bool",
            name: "registerInstallationCallback",
          },
          {
            type: "bytes4[]",
            name: "requiredInterfaces",
          },
          {
            type: "bytes4[]",
            name: "supportedInterfaces",
          },
          {
            type: "tuple[]",
            name: "callbackFunctions",
            components: [
              {
                type: "bytes4",
                name: "selector",
              },
            ],
          },
          {
            type: "tuple[]",
            name: "fallbackFunctions",
            components: [
              {
                type: "bytes4",
                name: "selector",
              },
              {
                type: "uint256",
                name: "permissionBits",
              },
            ],
          },
        ],
      },
    ],
  },
] as const;

/**
 * Checks if the `getInstalledModules` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getInstalledModules` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetInstalledModulesSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetInstalledModulesSupported(contract);
 * ```
 */
export async function isGetInstalledModulesSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getInstalledModules function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetInstalledModulesResult } from "thirdweb/extensions/modular";
 * const result = decodeGetInstalledModulesResult("...");
 * ```
 */
export function decodeGetInstalledModulesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getInstalledModules" function on the contract.
 * @param options - The options for the getInstalledModules function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getInstalledModules } from "thirdweb/extensions/modular";
 *
 * const result = await getInstalledModules({
 *  contract,
 * });
 *
 * ```
 */
export async function getInstalledModules(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
