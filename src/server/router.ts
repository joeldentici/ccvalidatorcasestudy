import { publicProcedure, router } from "./trpc";
import { z } from "zod";

function isValidLuhn(digits: number[]) {
  let checkDigit = 0;

  for (let i = digits.length - 2; i >= 0; --i) {
    checkDigit += (() => {
      if (i % 2 === digits.length % 2) {
        return digits[i] > 4 ? digits[i] * 2 - 9 : digits[i] * 2;
      }

      return digits[i];
    })();
  }

  return 10 - (checkDigit % 10) === digits[digits.length - 1];
}

export const appRouter = router({
  isValidCardNumber: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;

    const digits = input.split("").map(Number);

    return isValidLuhn(digits);
  }),
});

export type AppRouter = typeof appRouter;
