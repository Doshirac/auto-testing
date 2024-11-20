import { writeFileSync, readFileSync } from 'fs';

export class Calculator {
    sum(...args: number[]): number {
        let result = 0

        if (args.length === 0) {
            throw new Error("At least one number must be provided to sum.");
        }
        
        args.forEach((num) => {
            if (!isFinite(num)) {
                throw new Error(`Invalid input: all numbers must be a finite number. Received: ${num}`)
            }
            result += num
        })    

        return result;
    }

    subtract(n1: number, n2: number): number {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw new Error(`Invalid input: all numbers must be a finite number. Received: ${n1} and ${n2}`);
        }

        return n1 - n2;
    }

    multiply(...args: number[]): number {
        let result = 1

        if (args.length === 0) {
            throw new Error("At least one number must be provided to multiply.");
        }

        args.forEach((num) => {
            if (!isFinite(num)) {
                throw new Error(`Invalid input: all numbers must be a finite number. Received: ${num}`)
            }
            result *= num
        }) 

        return result;
    }

    divide(n1: number, n2: number): number {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw new Error(`Invalid input: all numbers must be a finite number. Received: ${n1} and ${n2}`);
        }
        
        if (n2 === 0) {
            throw new Error('Division by zero is not allowed.');
        }
        
        return n1 / n2;
    }

    sumFromFile(filePath: string): number {
        try {
            const data = readFileSync(filePath, 'utf-8');
            const numbers = data
                .split(/[\n,]+/)
                .map((num) => parseFloat(num))
                .filter((num) => !isNaN(num));

            if (numbers.length === 0) {
                throw new Error('No valid numbers found in the file.');
            }
    
            return this.sum(...numbers);
        } catch (error) {
            throw new Error(`Failed to sum numbers from file: ${(error as Error).message}`);
        }
    }

    static writeToFile(filePath: string, data: any): void {
        const content = `result: ${data}`;
        try {
            writeFileSync(filePath, content, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write to file: ${(error as Error).message}`);
        }
    }
}