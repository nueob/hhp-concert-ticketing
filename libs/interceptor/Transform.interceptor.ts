import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CustomApiResponse } from "libs/common/CustomApiResponse";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        res.status(HttpStatus.OK);

        return new CustomApiResponse(data);
      }),
    );
  }
}
