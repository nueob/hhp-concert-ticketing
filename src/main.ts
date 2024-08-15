import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { WinstonLogger } from "../libs/config/WinstonLogger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger().logger,
  });

  const config = new DocumentBuilder()
    .setTitle("콘서트 예약 서비스 API")
    .setVersion("1.0")
    .addSecurity("accessToken", {
      type: "apiKey",
      name: "x-access-token",
      in: "header",
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["localhost:9092"],
      },
      consumer: {
        groupId: "nestjs-group", // 소비자 그룹 ID 설정
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
