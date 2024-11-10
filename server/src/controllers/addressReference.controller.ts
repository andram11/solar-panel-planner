import { Request, Response, NextFunction } from "express";
import { getAddressReference } from "../services/addressService";
import { AppError } from "../utils/AppError";

export const httpGetAddressReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Check the query parameter is present and of proper type
    const { referenceType } = req.query;
    if (typeof referenceType !== "string" || referenceType.trim() === "") {
      throw new AppError(
        "Expected search parameter 'referenceType' is missing or invalid.",
        400
      );
    }

    const references = await getAddressReference(referenceType);
    res.status(200).json({ data: references });
  } catch (err) {
    next(err);
  }
};
