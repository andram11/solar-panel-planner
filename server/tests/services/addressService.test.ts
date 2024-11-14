import {
  searchAddresses,
  getAddressReference,
} from "../../src/services/addressService";
import { prisma } from "../../src/utils/dbClient";


describe("searchAddresses integration test", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return results when searching by streetName", async () => {
    const results = await searchAddresses(undefined, "FLORIDA", undefined);
    expect(results).toEqual(
      expect.arrayContaining([
        {
          id: 81,
          street_name: "FLORIDA",
          street_suffix_type: "ST",
          full_address: "2928 FLORIDA ST",
          zip: 70806,
        },
      ])
    );
  });

  it("should throw an error if no parameters are provided", async () => {
    await expect(searchAddresses()).rejects.toThrow(
      "At least one search parameter must be provided."
    );
  });

  it("should return results when searching by zip code", async () => {
    const results = await searchAddresses(undefined, undefined, "70815");
    expect(results).toEqual(
      expect.arrayContaining([
        {
          id: 207,
          street_name: "FLORIDA",
          street_suffix_type: "BLVD",
          full_address: "9244 FLORIDA BLVD, STE E",
          zip: 70815,
        },
      ])
    );
  });

  it("should return results when searching by suffix Type", async () => {
    const results = await searchAddresses("blvd", undefined, undefined);
    expect(results).toEqual(
      expect.arrayContaining([
        {
          id: 3,
          street_name: "SHERWOOD FOREST",
          street_suffix_type: "BLVD",
          full_address: "5830 S SHERWOOD FOREST BLVD, STE A6",
          zip: 70816,
        },
      ])
    );
  });
});

describe("getAddressReference integration test", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return results when searching by streetSuffixType", async () => {
    const results = await getAddressReference("streetSuffixType");
    expect(results).toEqual(expect.arrayContaining(["AVE", "BLVD"]));
  });

  it("should return results when searching by streetPrefixDirection", async () => {
    const results = await getAddressReference("streetPrefixDirection");
    expect(results).toEqual(expect.arrayContaining(["E", "N"]));
  });

  it("should return results when searching by streetPrefixType", async () => {
    const results = await getAddressReference("streetPrefixType");
    expect(results).toEqual(expect.arrayContaining(["AVENUE", "RUE"]));
  });

  it("should return results when searching by streetSuffixDirection", async () => {
    const results = await getAddressReference("streetSuffixDirection");
    expect(results).toEqual(expect.arrayContaining(["E", "N"]));
  });

  it("should return results when searching by streetName", async () => {
    const results = await getAddressReference("streetName");
    expect(results).toEqual(expect.arrayContaining(["OBSIDIAN", "MONROE"]));
  });

  it("should return results when searching by streetExtension", async () => {
    const results = await getAddressReference("streetExtension");
    expect(results).toEqual(expect.arrayContaining(["EXT"]));
  });

  it("should return results when searching by city", async () => {
    const results = await getAddressReference("city");
    expect(results).toEqual(expect.arrayContaining(["BAKER", "BATON ROUGE"]));
  });

  it("should return results when searching by zipCode", async () => {
    const results = await getAddressReference("zipCode");
    expect(results).toEqual(expect.arrayContaining([70714, 70722]));
  });

  it("should throw an error if invalid reference type is provided", async () => {
    await expect(getAddressReference("zipCode22")).rejects.toThrow(
      "Invalid reference type."
    );
  });
});
