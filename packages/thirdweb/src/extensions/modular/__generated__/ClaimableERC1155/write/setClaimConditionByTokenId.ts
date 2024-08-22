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
 * Represents the parameters for the "setClaimConditionByTokenId" function.
 */
export type SetClaimConditionByTokenIdParams = WithOverrides<{
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_id" }>;
  claimCondition: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_claimCondition";
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

export const FN_SELECTOR = "0xb7720475" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_id",
  },
  {
    type: "tuple",
    name: "_claimCondition",
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
 * Checks if the `setClaimConditionByTokenId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setClaimConditionByTokenId` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isSetClaimConditionByTokenIdSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isSetClaimConditionByTokenIdSupported(contract);
 * ```
 */
export async function isSetClaimConditionByTokenIdSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setClaimConditionByTokenId" function.
 * @param options - The options for the setClaimConditionByTokenId function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetClaimConditionByTokenIdParams } "thirdweb/extensions/modular";
 * const result = encodeSetClaimConditionByTokenIdParams({
 *  id: ...,
 *  claimCondition: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionByTokenIdParams(
  options: SetClaimConditionByTokenIdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.id, options.claimCondition]);
}

/**
 * Encodes the "setClaimConditionByTokenId" function into a Hex string with its parameters.
 * @param options - The options for the setClaimConditionByTokenId function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetClaimConditionByTokenId } "thirdweb/extensions/modular";
 * const result = encodeSetClaimConditionByTokenId({
 *  id: ...,
 *  claimCondition: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionByTokenId(
  options: SetClaimConditionByTokenIdParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetClaimConditionByTokenIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setClaimConditionByTokenId" function on the contract.
 * @param options - The options for the "setClaimConditionByTokenId" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { setClaimConditionByTokenId } from "thirdweb/extensions/modular";
 *
 * const transaction = setClaimConditionByTokenId({
 *  contract,
 *  id: ...,
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
export function setClaimConditionByTokenId(
  options: BaseTransactionOptions<
    | SetClaimConditionByTokenIdParams
    | {
        asyncParams: () => Promise<SetClaimConditionByTokenIdParams>;
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
      return [resolvedOptions.id, resolvedOptions.claimCondition] as const;
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
