import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { DOODLES_CONTRACT, USDT_CONTRACT } from "~test/test-contracts.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { getContract } from "../../../../../contract/contract.js";
import { getNFTMedia } from "./index.js";

const client = TEST_CLIENT;

describe("NFTMedia", () => {
  it("should return a valid image src for Doodles", async () => {
    const src = await getNFTMedia({
      contract: DOODLES_CONTRACT,
      tokenId: 1n,
      client,
    });
    expect(src).toBe("ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9");
  });

  it("should return the image data for CryptoPunks", async () => {
    const src = await getNFTMedia({
      contract: getContract({
        address: "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2",
        client,
        chain: ethereum,
      }),
      tokenId: 1n,
      client,
    });
    expect(src.startsWith("data:image/svg+xml;utf8")).toBe(true);
  });

  it("should throw an error if failed to load token uri", async () => {
    await expect(() =>
      getNFTMedia({ contract: USDT_CONTRACT, tokenId: 1n, client }),
    ).rejects.toThrowError(
      `Could not get the URI for tokenId: ${1n}. Make sure the contract has the proper method to fetch it.`,
    );
  });

  it("should throw an error if the `overrideMediaField` is not a string (url)", async () => {
    await expect(() =>
      getNFTMedia({
        contract: DOODLES_CONTRACT,
        tokenId: 1n,
        client,
        overrideMediaField: "image_data",
      }),
    ).rejects.toThrowError("Invalid value for image_data - expected a string");
  });
});
