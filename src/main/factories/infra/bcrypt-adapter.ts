import { BcryptAdapter } from "@/infra/cryptograph";

export const makeBcryptAdapter = () => new BcryptAdapter(12)