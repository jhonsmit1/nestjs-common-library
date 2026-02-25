import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { requestContext } from "./request-context";

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = uuidv4();

  res.setHeader("X-Request-ID", requestId);

  const authorization = req.headers["authorization"] as string | undefined;

  requestContext.run(
    {
      requestId,
      authorization,
    },
    () => next()
  );
}
