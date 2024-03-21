import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { useActiveAccount } from "../wallets/wallet-hooks.js";
import {
  estimateGasCost,
  type EstimateGasCostResult,
} from "../../../../transaction/actions/estimate-gas-cost.js";

/**
 * A hook to estimate the gas cost in ether and wei for a given transaction.
 * @returns A mutation object to estimate gas cost.
 * @example
 * ```jsx
 * import { useEstimateGasCost } from "thirdweb/react";
 * const { mutate: estimateGasCost, data: gasEstimate } = useEstimateGas();
 *
 * // later
 * const estimatedGas = await estimateGasCost(tx);
 * console.log("gas cost in ether", estimatedGas.ether);
 * ```
 * @transaction
 */
export function useEstimateGasCost(): UseMutationResult<
  EstimateGasCostResult,
  Error,
  PreparedTransaction
> {
  const account = useActiveAccount();

  return useMutation({
    mutationFn: (transaction) => estimateGasCost({ transaction, account }),
  });
}
