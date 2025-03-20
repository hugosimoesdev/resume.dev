import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create resume (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /resumes", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post("/resumes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New resume",
        description: "New description",
      });

    expect(response.statusCode).toBe(201);

    const resumeOnDatabase = await prisma.resume.findFirst({
      where: {
        title: "New resume",
      },
    });

    expect(resumeOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
