import type { DecodeEventLogReturnType, Log } from "viem";
import type { ThirdwebContract } from "../../contract/contract.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatIndexerEvents } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  IndexerInternalEvent,
  IndexerPagingParams,
  IndexerResponse,
} from "../types.js";
import { getEventsEndpoint } from "../urls.js";

export type GetEventsInterval = "hour" | "day" | "week" | "month";
export type GetEventsGroupBy = "time" | "name" | "chainId" | "contractAddress";

export type GetEventsParams = Prettify<
  {
    /**
     * Contract to fetch events for
     */
    contract: ThirdwebContract;
    /**
     * Start point for events date range. Default is 7 days ago
     */
    startDate?: Date;
    /**
     * End point for events date range. Default is current date
     */
    endDate?: Date;
    /**
     * If grouped by time, determines the bucket length
     */
    interval?: GetEventsInterval;
    /**
     * Parameters to group events by for the count
     */
    groupBy?: GetEventsGroupBy[];
  } & IndexerPagingParams
>;

export type GetEventsResult = {
  events: Prettify<
    Log &
      DecodeEventLogReturnType & {
        chainId?: number;
        count: bigint;
        time?: Date;
      }
  >[];
  page?: number;
};

/**
 * @beta
 *
 * Get events emitted by contract(s)
 *
 * @param {GetEventsParams} params
 * @returns {Promise<GetEventsResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient, getEvents, defineChain, getContract } from "thirdweb";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const startDate = new Date(Date.now() - 48 * 60 * 60_000);
 * const endDate = new Date();
 * const contract = getContract({
 *  address: "0x...",
 *  client,
 *  chain: defineChain(1)
 * });
 * const events = await getEvents({
 *  client,
 *  contract,
 *  startDate,
 *  endDate,
 *  interval: ["day"],
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 */
export async function getEvents(
  params: GetEventsParams,
): Promise<GetEventsResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.contract.client)(
      url.toString(),
    );
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IndexerResponse<IndexerInternalEvent[]> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      events: formatIndexerEvents(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}

function getEndpointUrl(params: GetEventsParams): URL {
  const url = getEventsEndpoint();
  url.searchParams.append("contractAddress", params.contract.address);
  url.searchParams.append("chainId", params.contract.chain.id.toString());
  if (params.startDate) {
    url.searchParams.append("startDate", params.startDate.toISOString());
  }
  if (params.endDate) {
    url.searchParams.append("endDate", params.endDate.toISOString());
  }
  if (params.interval) {
    url.searchParams.append("interval", params.interval);
  }
  return addRequestPagination(url, params);
}
