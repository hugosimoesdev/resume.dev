import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { expect, test, describe } from "vitest";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/prisma/prisma.service";

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        email: "johndoe@example.com",
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
