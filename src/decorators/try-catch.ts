/* eslint-disable */
import { HttpException, HttpStatus } from '@nestjs/common';

const errorLogger = (error: Error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌☃️ Error: ${error.message}`);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
const isAsyncFunction = (func: any): func is Function => {
  return (
    func.constructor.name === 'AsyncFunction' && typeof func === 'function'
  );
};

/**
 *
 * @param message The message of the HttpException
 * @param code The code of the HttpException
 * @returns The HttpException if the function throws an error, otherwise the function will return the result of the function
 */
export const InjectHTTPExceptions = (
  message: string,
  code: HttpStatus | undefined = undefined,
) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const { value } = descriptor;
    if (isAsyncFunction(value)) {
      descriptor.value = async function (...args: any[]) {
        try {
          return await value.apply(this, args);
        } catch (error) {
          errorLogger(error);
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(message, code);
        }
      };
      return descriptor;
    }
    descriptor.value = function (...args: any[]) {
      try {
        return value.apply(this, args);
      } catch (error) {
        errorLogger(error);
        throw new HttpException(message, code);
      }
    };
    return descriptor;
  };
};
