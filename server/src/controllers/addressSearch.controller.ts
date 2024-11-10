import { Response, NextFunction } from "express";
import { searchAddresses } from "../services/addressService";
import { AddressSearchRequest } from "../interfaces/addressSearchRequest";
import { AppError } from "../utils/AppError";

export const httpSearchAddresses = async (
  req: AddressSearchRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { suffixType, streetName, zipCode } = req.query;
    //Check that at least one search query parameter is present
    if (!suffixType && !streetName && !zipCode) {
      throw new AppError(
        "At least one search parameter must be provided.",
        400
      );
    }

    //Call address service with provided parameters
    const addresses = await searchAddresses(suffixType, streetName, zipCode);

    res.status(200).json({ data: addresses });
  } catch (err) {
    next(err);
  }
};
