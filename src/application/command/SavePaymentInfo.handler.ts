import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SavePaymentInfoCommand } from "./SavePaymentInfo.command";

@CommandHandler(SavePaymentInfoCommand)
export class SavePaymentInfoHandler
  implements ICommandHandler<SavePaymentInfoCommand>
{
  execute(event: SavePaymentInfoCommand): Promise<void> {
    console.log("주문 번호 : " + event.orderId);
    console.log("주문자 : " + event.uuid);
    console.log("금액 : " + event.price);
    // 외부 API 호출
    return Promise.resolve();
  }
}
