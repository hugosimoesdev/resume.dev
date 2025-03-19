import { HttpCode, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

// const createResumeBodySchema = z.object({
//   title: z.string(),
//   description: z.string(),
// });

// type CreateResumeBodySchema = z.infer<typeof createResumeBodySchema>;

@Controller("resumes")
@UseGuards(JwtAuthGuard)
export class CreateResumeController {
  // constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle() {
    return "ok";
  }
}
