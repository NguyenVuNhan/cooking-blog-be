import { NextFunction, Request, Response } from "express";
import IUser from "../models/user";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export interface INext extends NextFunction {}

export interface IReq extends Request {}

export interface IRes extends Response {}
