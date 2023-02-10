import bcrypt from "bcrypt";
import { PasswordHasher } from "../../../core/util/PasswordHasher";

class PasswordHasherBcrypt implements PasswordHasher {
  async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export {
  PasswordHasherBcrypt,
};