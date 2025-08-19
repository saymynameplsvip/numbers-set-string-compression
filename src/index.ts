const ALPHABET = "0123456789!\" %&'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}".split("");
const RADIX = ALPHABET.length - 1;
const DIVIDER = "~"
const SEQUENCE_SYMBOL = "$";
const PROGRESSION_SYMBOL = "#";

const baseToNumberCache: Map<string, number> = new Map(ALPHABET.map((digit, index) => [digit, index]));
const numberToBaseCache: Map<number, string> = new Map();

function findDuplicateSequences(numbers: number[]) {
    const sequences: Map<number, { value: number, length: number }> = new Map();

    let start=0,end=1;
    
    while(true) {
        if (end >= numbers.length) {
            if ((numbers[start] < RADIX && end - start >= 5) || (numbers[start] >= RADIX && end - start >= 3)) {
                sequences.set(start, { value: numbers[start], length: end - start });
            }
          return sequences;
        }

        if (numbers[end] == 0) {
          start = end + 1;
          end += 2;
          continue;
        }

        if (numbers[end] == numbers[start]) {
            end++;
        } else {
            if ((numbers[start] < RADIX && end - start >= 5) || (numbers[start] >= RADIX && end - start >= 3)) {
                sequences.set(start, { value: numbers[start], length: end - start });
            }

            start = end;
            end++;
        }
    }
}

function findProgressionSequences(numbers: number[]) {
  const sequences: Map<number, { start: number, step: number, end: number }> = new Map();

  let start = 0, step, end;
  while (start < numbers.length - 2) {
    step = numbers[start + 1] - numbers[start];
    if (step === 0) {
      start++;
      continue;
    }
    end = start + 1;
    while (
      end < numbers.length &&
      numbers[end] - numbers[end - 1] === step
    ) {
      end++;
    }

    if (
      (numbers[start] >= RADIX && end - start >= 3) ||
      (numbers[start] < RADIX && end - start >= 6)
    ) {
      sequences.set(start, { start: numbers[start], step, end });
      for (let i = start; i < end; i++) {
        numbers[i] = 0;
      }
      start = end;
    } else {
      start++;
    }
  }

  return sequences;
}

function convertToBase(number: number, base: number, digits: string[], cache: Map<number, string> = numberToBaseCache): string {
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("Number must be a non-negative integer");
  }
  if (!Number.isInteger(base) || base < 2 || base > digits.length) {
    throw new Error("Base must be an integer between 2 and the length of digits array");
  }

  const cached = cache.get(number);
  if (cached) {
    return cached;
  }

  if (number === 1) {
    return digits[1];
  }

  const result: string[] = [];
  let num: number = number;

  while (num > 0) {
    result.push(digits[num % base]);
    num = Math.floor(num / base);
  }

  const stringResult = result.reverse().join('');
  cache.set(number, stringResult);

  return stringResult;
}

function convertFromBase(numberStr: string, base: number, digits: string[], cache: Map<string, number> = baseToNumberCache): number {
  if (typeof numberStr !== 'string' || !numberStr) {
    throw new Error("Number must be a non-empty string");
  }
  if (!Number.isInteger(base) || base < 2 || base > digits.length) {
    throw new Error("Base must be an integer between 2 and the length of digits array");
  }

  const cached = cache.get(numberStr);
  if (cached) {
    return cached;
  }

  let result: number = 0;
  let digitValue;
  for (const char of numberStr) {
    digitValue = cache.get(char);
    if (digitValue === undefined) {
      throw new Error(`Invalid character ${char} in number string`);
    }
    result = result * base + digitValue;
  }
  cache.set(numberStr, result);
  return result;
}

export function serializeSet(numbers: number[]) {
  const arr = [...numbers].sort((a,b) => a - b);

  const progressionSequences = findProgressionSequences(arr);
    const dublicateSequences = findDuplicateSequences(arr);

    const result: string[] = [];
    let isPivotSet = false;
    let sequence;
    let num;
    for (let index = 0; index < arr.length;) {
        num = arr[index];
        if (!isPivotSet && num >= RADIX) {
            result.push(DIVIDER);
            isPivotSet = true;
        }
        if (progressionSequences.has(index)) {
            sequence = progressionSequences.get(index);
            result.push(`${PROGRESSION_SYMBOL}${sequence.start < RADIX ? "0" : ""}${convertToBase(sequence.start, RADIX, ALPHABET)}${sequence.end - index < RADIX ? "0" : ""}${convertToBase(sequence.end - index, RADIX, ALPHABET)}${sequence.step < RADIX ? "0" : ""}${convertToBase(sequence.step, RADIX, ALPHABET)}`);
            index += sequence.end - index;
            continue;
        }
        if (dublicateSequences.has(index)) {
            sequence = dublicateSequences.get(index);
            result.push(`${SEQUENCE_SYMBOL}${sequence.length < RADIX ? "0" : ""}${convertToBase(sequence.length, RADIX, ALPHABET)}${sequence.value < RADIX ? "0" : ""}${convertToBase(sequence.value, RADIX, ALPHABET)}`);
            index += sequence.length;
            continue;
        }
        result.push(convertToBase(num, RADIX, ALPHABET))
        index++;
    }
    const stringResult = result.join("");

    return stringResult;
}

export function deserializeSet(str: string) {
    const result: number[] = [];
    let isMulti = false;
    let startIdx, start, length, step, symbol;
    for (let i = 0; i < str.length; ) {
        if (str[i] === SEQUENCE_SYMBOL) {
            startIdx = i + 1;
            length = convertFromBase(str.slice(startIdx, startIdx + 2), RADIX, ALPHABET);
            symbol =  convertFromBase(str.slice(startIdx + 2, startIdx + 4), RADIX, ALPHABET);
            for (let k = 0; k < length; k++) {
                result.push(symbol);
            }
            i += 5;
            continue;
        }
        if (str[i] === PROGRESSION_SYMBOL) {
            startIdx = i + 1;
            start = convertFromBase(str.slice(startIdx, startIdx + 2), RADIX, ALPHABET);
            length = convertFromBase(str.slice(startIdx + 2, startIdx + 4), RADIX, ALPHABET);
            step = convertFromBase(str.slice(startIdx + 4, startIdx + 6), RADIX, ALPHABET);
            for (let k = 0; k < length; k++) {
                result.push(start + k * step);
            }
            i += 7;
            continue;
        }
        if (!isMulti) {
            if (str[i] === DIVIDER) {
                isMulti = true;
                i++;
                continue;
            }
            result.push(convertFromBase(str[i], RADIX, ALPHABET))
            i++;
        } else {
            result.push(convertFromBase(str.slice(i, i + 2), RADIX, ALPHABET))
            i += 2;
        }
    }
    return result;
}