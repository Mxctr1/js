import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "setClaimCondition" function.
 */
export type SetClaimConditionParams = WithOverrides<{
  claimCondition: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "claimCondition";
    components: [
      { type: "uint256"; name: "availableSupply" },
      { type: "bytes32"; name: "allowlistMerkleRoot" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "address"; name: "currency" },
      { type: "uint48"; name: "startTimestamp" },
      { type: "uint48"; name: "endTimestamp" },
      { type: "string"; name: "auxData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x3564659c" as const;
const FN_INPUTS = [
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
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setClaimCondition` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setClaimCondition` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isSetClaimConditionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isSetClaimConditionSupported(contract);
 * ```
 */
export async function isSetClaimConditionSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setClaimCondition" function.
 * @param options - The options for the setClaimCondition function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetClaimConditionParams } "thirdweb/extensions/modular";
 * const result = encodeSetClaimConditionParams({
 *  claimCondition: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionParams(
  options: SetClaimConditionParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.claimCondition]);
}

/**
 * Encodes the "setClaimCondition" function into a Hex string with its parameters.
 * @param options - The options for the setClaimCondition function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetClaimCondition } "thirdweb/extensions/modular";
 * const result = encodeSetClaimCondition({
 *  claimCondition: ...,
 * });
 * ```
 */
export function encodeSetClaimCondition(options: SetClaimConditionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetClaimConditionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setClaimCondition" function on the contract.
 * @param options - The options for the "setClaimCondition" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { setClaimCondition } from "thirdweb/extensions/modular";
 *
 * const transaction = setClaimCondition({
 *  contract,
 *  claimCondition: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setClaimCondition(
  options: BaseTransactionOptions<
    | SetClaimConditionParams
    | {
        asyncParams: () => Promise<SetClaimConditionParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.claimCondition] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
