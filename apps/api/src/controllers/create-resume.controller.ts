import { Body, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "./pipes/zod-validation-pipe";

const createResumeBodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

type CreateResumeBodySchema = z.infer<typeof createResumeBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createResumeBodySchema);

@Controller("resumes")
@UseGuards(JwtAuthGuard)
export class CreateResumeController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateResumeBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, description } = body;
    const userId = user.sub;

    await this.prisma.resume.create({
      data: {
        title,
        description,
        userId,
      },
    });
  }
}
