import { searchAddresses } from '../../src/services/addressService';
import { prisma } from '../../src/utils/dbClient';

describe('searchAddresses integration test', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return results when searching by streetName', async () => {
    const results = await searchAddresses(undefined, 'FLORIDA', undefined);
    expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining(
        {
            id: 211,
            street_name: "FLORIDA",
            street_suffix_type: "BLVD",
            full_address: "9244 FLORIDA BLVD, STE E",
            zip: 70815
        })
    ]));
  });

  it('should throw an error if no parameters are provided', async () => {
    await expect(searchAddresses()).rejects.toThrow('At least one search parameter must be provided.');
  });

  it('should return results when searching by zip code', async () => {
    const results = await searchAddresses(undefined, undefined, '70815');
    expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining(
        {
            id: 211,
            street_name: "FLORIDA",
            street_suffix_type: "BLVD",
            full_address: "9244 FLORIDA BLVD, STE E",
            zip: 70815
        })
    ]));
  });

  it('should return results when searching by suffix Type', async () => {
    const results = await searchAddresses("blvd", undefined, undefined);
    expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining(
        {
            id: 211,
            street_name: "FLORIDA",
            street_suffix_type: "BLVD",
            full_address: "9244 FLORIDA BLVD, STE E",
            zip: 70815
        })
    ]));
  });
});
