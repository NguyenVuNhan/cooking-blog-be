import { NextFunction, Request, Response } from "express";

export interface INext extends NextFunction {}

export interface IReq extends Request {}

export interface IRes extends Response {}
