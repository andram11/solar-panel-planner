import { prisma } from "../utils/dbClient";

export const searchAddresses = async (
  suffixType?: string,
  streetName?: string,
  zipCode?: string
) => {
  //If all search parameters are provided we apply the AND operator
  const conditions: any = {};
  if (suffixType)
    conditions.street_suffix_type = { equals: suffixType, mode: "insensitive" };
  if (streetName)
    conditions.street_name = { contains: streetName, mode: "insensitive" };
  if (zipCode) conditions.zip = Number(zipCode);

  if (Object.keys(conditions).length === 0) {
    throw new Error("At least one search parameter must be provided.");
  }

  return await prisma.address_listing.findMany({
    where: conditions,
    orderBy: streetName ? { street_name: "asc" } : undefined,
    select: {
      id: true,
      street_name: true,
      street_suffix_type: true,
      full_address: true,
      zip: true,
    },
    take: 50, //TO DO: check if pagination is needed
  });
};

const columnMap: Record<string, string> = {
  streetSuffixType: "street_suffix_type",
  streetPrefixDirection: "street_prefix_direction",
  streetPrefixType: "street_prefix_type",
  streetName: "street_name",
  streetSuffixDirection: "street_suffix_direction",
  streetExtension: "street_extension",
  city: "city",
  zipCode: "zip",
};

export const getAddressReference = async (referenceType: string) => {

  // Map the referenceType to the actual column name
  const columnName: string = columnMap[referenceType];
  if (!columnName) {
    throw new Error("Invalid reference type.");
  }

  // Use raw SQL to select distinct values
  const results: { [key: string]: string }[] = await prisma.$queryRawUnsafe(
    `SELECT DISTINCT ${columnName} FROM planner."Address_listing"`
  );

  return results.map((results) => results[columnName]);
};



//Search by streetname with phonetic similarity (using $queryRaw)
/* const searchAddressesByStreetName= async(streetname: string)=> {
    return await prisma.$queryRaw`
    select full_address
    from planner."Address_listing"
    where street_name % ${streetname}
    order by similarity(street_name, ${streetname}) desc
    `
} */
