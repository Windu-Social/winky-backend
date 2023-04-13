import * as bcrypt from 'bcrypt';

/**
 * @description This enum is used to set the confident level of the hash data.
 * The higher the confident level, the more time it takes to generate the hash data.
 */
export enum ConfidentLevel {
  LOW = 5,
  MEDIUM = 10,
  HIGH = 15,
}

export const generateSaltUtils = async () => {
  const salt = await bcrypt.genSalt(ConfidentLevel.MEDIUM);
  return salt;
};

/**
 *
 * @param entryData entry data which will be hashed
 * @param confidentLevel confident level of the hash data. The higher the confident level, the more time it takes to generate the hash data.
 * @returns hash data string
 */
export const hashUtils = async (
  entryData: string | number,
  confidentLevel: ConfidentLevel = ConfidentLevel.MEDIUM,
) => {
  const hash = await bcrypt.hash(entryData.toString(), confidentLevel);
  return hash;
};

export const compareHashUtils = async (
  originData: string,
  hashData: string,
) => {
  return await bcrypt.compare(originData, hashData);
};
