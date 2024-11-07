import {Request} from 'express'

export interface AddressSearchRequest extends Request {
    query: {
        suffixType?: string;
        streetName?: string;
        zipCode?: string
    }
}