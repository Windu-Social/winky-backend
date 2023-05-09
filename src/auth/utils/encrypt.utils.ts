import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

import * as cryptoConfigs from 'src/config/crypto.config.json';

export const encryptMessageUtils = async (password: string) => {
  const { PASSWORD_ENCRYPT } = cryptoConfigs;

  const iv = randomBytes(16);
  const key = (await promisify(scrypt)(PASSWORD_ENCRYPT, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const passwordEncrypt = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return passwordEncrypt.toString('hex');
};

export const descryptMessageUtils = async (
  encryptedPassword: NodeJS.ArrayBufferView,
) => {
  const { PASSWORD_ENCRYPT } = cryptoConfigs;

  const iv = randomBytes(16);
  const key = (await promisify(scrypt)(PASSWORD_ENCRYPT, 'salt', 32)) as Buffer;

  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  const decryptedPassword = Buffer.concat([
    decipher.update(encryptedPassword),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};
