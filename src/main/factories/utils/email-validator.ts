import { EmailValidatorAdapter } from "@/presentation/utils";

export const makeEmailValidator = () => new EmailValidatorAdapter()