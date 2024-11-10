import express from "express";
import { httpGetAddressReference } from "../controllers/addressReference.controller";

const addressReferenceRouter = express.Router();

export default addressReferenceRouter.get(
  "/address/reference",
  httpGetAddressReference
);
