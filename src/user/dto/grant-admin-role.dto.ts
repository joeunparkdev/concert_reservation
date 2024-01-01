import { ApiProperty } from "@nestjs/swagger";

export class GrantAdminRoleDto {
  @ApiProperty()
  userId: number;
}
