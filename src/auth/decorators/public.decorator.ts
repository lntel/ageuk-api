import { SetMetadata } from "@nestjs/common";

// https://github.com/nestjs/nest/issues/964#issuecomment-480834786
export const Public = () => SetMetadata("isPublic", true);