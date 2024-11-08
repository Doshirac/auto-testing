import { describe, test, expect, beforeEach, vi, MockedFunction } from 'vitest';
import { writeFileSync, readFileSync } from 'fs';
import { Calculator } from '../../src/Calculator';

vi.mock('fs', () => ({
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
}));

const mockedWriteFileSync = writeFileSync as MockedFunction<typeof writeFileSync>;
const mockedReadFileSync = readFileSync as MockedFunction<typeof readFileSync>;

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        vi.resetAllMocks();
        calculator = new Calculator();
    });

    describe('sum', () => {
        test('should correctly sum multiple positive numbers', () => {
            expect(calculator.sum(1, 2, 3, 4, 5)).toBe(15);
        });

        test('should correctly sum multiple negative numbers', () => {
            expect(calculator.sum(-1, -2, -3, -4, -5)).toBe(-15);
        });

        test('should correctly sum a mix of positive and negative numbers', () => {
            expect(calculator.sum(10, -5, 3, -2)).toBe(6);
        });

        test('should correctly sum floating-point numbers', () => {
            expect(calculator.sum(1.5, 2.5, 3.0)).toBe(7.0);
        });

        test('should correctly sum a single number', () => {
            expect(calculator.sum(42)).toBe(42);
        });

        test('should throw an error when no arguments are provided', () => {
            expect(() => calculator.sum()).toThrowError("At least one number must be provided to sum.");
        });

        test('should throw an error if any number is not finite', () => {
            expect(() => calculator.sum(1, 2, Infinity)).toThrow("Invalid input: all numbers must be a finite number. Received: Infinity");
        });
    });

    describe('subtract', () => {
        test('should correctly subtract when n1 > n2', () => {
            expect(calculator.subtract(10, 5)).toBe(5);
        });

        test('should correctly subtract when n1 < n2', () => {
            expect(calculator.subtract(5, 10)).toBe(-5);
        });

        test('should return zero when n1 equals n2', () => {
            expect(calculator.subtract(7, 7)).toBe(0);
        });

        test('should throw an error if any number is not finite', () => {
            expect(() => calculator.subtract(NaN, 5)).toThrow("Invalid input: all numbers must be a finite number. Received: NaN and 5");
            expect(() => calculator.subtract(5, Infinity)).toThrow("Invalid input: all numbers must be a finite number. Received: 5 and Infinity");
            expect(() => calculator.subtract(NaN, Infinity)).toThrow("Invalid input: all numbers must be a finite number. Received: NaN and Infinity");
        });

        test('should throw an error if any number is missing', () => {
            expect(() => calculator.subtract(undefined, 5)).toThrow("Invalid input: all numbers must be a finite number. Received: undefined and 5");
            expect(() => calculator.subtract(10, undefined)).toThrow("Invalid input: all numbers must be a finite number. Received: 10 and undefined");
            expect(() => calculator.subtract(undefined, undefined)).toThrow("Invalid input: all numbers must be a finite number. Received: undefined and undefined");
        });
    });

    describe('multiply', () => {
        test('should correctly multiply multiple positive numbers', () => {
            expect(calculator.multiply(2, 3, 4)).toBe(24);
        });

        test('should correctly multiply multiple negative numbers', () => {
            expect(calculator.multiply(-2, -3, -4)).toBe(-24);
        });

        test('should correctly multiply a mix of positive and negative numbers', () => {
            expect(calculator.multiply(2, -3, 4)).toBe(-24);
        });

        test('should correctly multiply floating-point numbers', () => {
            expect(calculator.multiply(1.5, 2.0, 3.0)).toBe(9.0);
        });

        test('should correctly multiply a single number', () => {
            expect(calculator.multiply(42)).toBe(42);
        });

        test('should throw an error when no arguments are provided', () => {
            expect(() => calculator.multiply()).toThrowError("At least one number must be provided to multiply.");
        });

        test('should return 0 if any argument is zero', () => {
            expect(calculator.multiply(2, 0, 4)).toBe(0);
        });

        test('should throw an error if any number is not finite', () => {
            expect(() => calculator.multiply(2, NaN, 3)).toThrow("Invalid input: all numbers must be a finite number. Received: NaN");
            expect(() => calculator.multiply(2, Infinity, 3)).toThrow("Invalid input: all numbers must be a finite number. Received: Infinity");
        });
    });

    describe('divide', () => {
        test('should correctly divide when n1 is divisible by n2', () => {
            expect(calculator.divide(10, 2)).toBe(5);
        });

        test('should correctly divide when n1 is not divisible by n2', () => {
            expect(calculator.divide(7, 2)).toBeCloseTo(3.5);
        });

        test('should correctly handle division by negative numbers', () => {
            expect(calculator.divide(10, -2)).toBe(-5);
        });

        test('should throw an error when dividing by zero', () => {
            expect(() => calculator.divide(10, 0)).toThrowError('Division by zero is not allowed.');
        });

        test('should throw an error if any number is not finite', () => {
            expect(() => calculator.divide(NaN, 5)).toThrow("Invalid input: all numbers must be a finite number. Received: NaN and 5");
            expect(() => calculator.divide(5, Infinity)).toThrow("Invalid input: all numbers must be a finite number. Received: 5 and Infinity");
            expect(() => calculator.divide(NaN, Infinity)).toThrow("Invalid input: all numbers must be a finite number. Received: NaN and Infinity");
        });

        test('should throw an error if any number is not finite', () => {
            expect(() => calculator.divide(undefined, 5)).toThrow("Invalid input: all numbers must be a finite number. Received: undefined and 5");;
            expect(() => calculator.divide(10, undefined)).toThrow("Invalid input: all numbers must be a finite number. Received: 10 and undefined");
            expect(() => calculator.divide(undefined, undefined)).toThrow("Invalid input: all numbers must be a finite number. Received: undefined and undefined");
        });
    });

    describe('sumFromFile', () => {
        test('should return the sum of numbers read from a file', () => {
            const filePath = 'numbers.txt';
            const fileContent = '1,2,3\n4';
            mockedReadFileSync.mockReturnValue(fileContent);

            const result = calculator.sumFromFile(filePath);
            expect(result).toBe(10);
            expect(readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
        });

        test('should handle files with only one number', () => {
            const filePath = 'singleNumber.txt';
            const fileContent = '42';
            mockedReadFileSync.mockReturnValue(fileContent);

            const result = calculator.sumFromFile(filePath);
            expect(result).toBe(42);
        });

        test('should throw an error if the file is empty', () => {
            const filePath = 'empty.txt';
            const fileContent = '';
            mockedReadFileSync.mockReturnValue(fileContent);

            expect(() => calculator.sumFromFile(filePath)).toThrow('Failed to sum numbers from file: No valid numbers found in the file.');
        });

        test('should throw an error if the file does not contain valid numbers', () => {
            const filePath = 'invalid.txt';
            const fileContent = 'a,b,c';
            mockedReadFileSync.mockReturnValue(fileContent);
    
            expect(() => calculator.sumFromFile(filePath)).toThrow('Failed to sum numbers from file: No valid numbers found in the file.');
        });

        test('should propagate file read errors', () => {
            const filePath = 'nonexistent.txt';
            const errorMessage = 'ENOENT: no such file or directory';
            mockedReadFileSync.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            expect(() => calculator.sumFromFile(filePath)).toThrow(`Failed to sum numbers from file: ${errorMessage}`);
        });
    });

    describe('writeToFile', () => {
        test('should write the result to a file in the correct format', () => {
            const filePath = 'result.txt';
            const data = 100;

            Calculator.writeToFile(filePath, data);

            expect(writeFileSync).toHaveBeenCalledWith(filePath, `result: ${data}`, 'utf-8');
        });

        test('should handle string data correctly', () => {
            const filePath = 'result.txt';
            const data = 'Success';

            Calculator.writeToFile(filePath, data);

            expect(writeFileSync).toHaveBeenCalledWith(filePath, `result: ${data}`, 'utf-8');
        });

        test('should handle complex data types by converting to string', () => {
            const filePath = 'result.txt';
            const data = { a: 1, b: 2 };

            Calculator.writeToFile(filePath, data);

            expect(writeFileSync).toHaveBeenCalledWith(filePath, `result: ${data}`, 'utf-8');
        });

        test('should propagate file write errors', () => {
            const filePath = 'readonly.txt';
            const data = 50;
            const errorMessage = 'EACCES: permission denied';

            mockedWriteFileSync.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            expect(() => Calculator.writeToFile(filePath, data)).toThrow(`Failed to write to file: ${errorMessage}`);
        });
    });
});
