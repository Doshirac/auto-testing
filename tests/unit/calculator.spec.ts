import { sum } from "../../src/calculator";
import { test, expect } from 'vitest';

test('sum two positive numbers', () => {
    expect(sum(1, 2)).toEqual(3)
})