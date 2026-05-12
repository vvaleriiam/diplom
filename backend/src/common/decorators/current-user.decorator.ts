import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type JwtUser = {
  sub: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUser => context.switchToHttp().getRequest().user,
);
