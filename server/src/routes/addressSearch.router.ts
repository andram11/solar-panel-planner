import express, {Request, Response, NextFunction} from 'express'
import { httpSearchAddresses } from '../controllers/addressSearch.controller'

const addressSearchRouter= express.Router()

export default addressSearchRouter.get("/address/search", httpSearchAddresses)
