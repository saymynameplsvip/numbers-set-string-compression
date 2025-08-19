import { deserializeSet, serializeSet } from ".";

function naiveSerialization(numbers: number[]) {
    return numbers.join();
}

function generateRandomArray(length: number, max: number = 300) {
    const arr: number[] = [];
    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * max) + 1);
    }
    return arr;
}

const testCases: { name: string; data: number[] }[] = [
    { name: "shortest: [1]", data: [1] },
    { name: "shortest: [1,2]", data: [1, 2] },
    { name: "shortest: [1,2,3]", data: [1, 2, 3] },
    { name: "50 random numbers", data: generateRandomArray(50) },
    { name: "100 random numbers", data: generateRandomArray(100) },
    { name: "500 random numbers", data: generateRandomArray(500) },
    { name: "1000 random numbers", data: generateRandomArray(1000) },
    { name: "all 1-digit numbers", data: Array.from({ length: 9 }, (_, i) => i + 1) },
    { name: "all 2-digit numbers", data: Array.from({ length: 90 }, (_, i) => i + 10) },
    { name: "all 3-digit numbers", data: Array.from({ length: 900 }, (_, i) => i + 100) },
    { name: "each 3-digit number 3 times", data: Array.from({ length: 900 }, (_, i) => 100 + Math.floor(i / 3)) },
];

describe("compression algorithm", () => {
    testCases.forEach(({ name, data }) => {
        test(name, () => {
            data = data.sort((a,b) => a - b);
            const serialized = serializeSet(data);
            const deserialized = deserializeSet(serialized);
            const naiveSerialized = naiveSerialization(data);

            const compressionRate = naiveSerialized.length / serialized.length;
            console.log(`${name}, compression rate is: ${compressionRate}`);

            expect(deserialized).toStrictEqual(data);
            expect(compressionRate).toBeGreaterThanOrEqual(2);
        });
    });
});