import { PickType } from "@nestjs/swagger";
import { Reservation } from "../entities/reservation.entity";

export class FindAllReservationsResponseDto extends PickType(Reservation,['id','seat','user']) {


}