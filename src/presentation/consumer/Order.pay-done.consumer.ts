import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class OrderPayDoneController {
  @MessagePattern("pay-done")
  consumeMessage(@Payload() message: any) {
    console.log("Received message:", message.value);
  }
}
