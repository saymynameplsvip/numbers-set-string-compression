# numbers-set-string-compression

Алгоритм разрабатывался с упором на то, что это множество, соответственно - порядок неважен.

Идея алгоритма в том, чтобы преобразовать существующие числа в систему счисления с основанием $len(ALPHABET)$.

Создается маска последовательностей - сначала находим все последовательности в виде арифметической прогрессии, затем - все дубликатные последовательности.

Сложность алгоритма $O(n)$

---
Худший коэфициент сжатия: 1 `[1]`

Средний коэфициент сжатия на случайных данных: 2.34

Лучший коэфициент сжатия: 514.14 `[100..999]`

```
   shortest: [1], compression rate is: 1

    shortest: [1,2], compression rate is: 1.5

    shortest: [1,2,3], compression rate is: 1.6666666666666667

    50 random numbers, compression rate is: 2.0454545454545454

    100 random numbers, compression rate is: 2.1325301204819276

    500 random numbers, compression rate is: 2.3732303732303732

    1000 random numbers, compression rate is: 2.8418167580266247

    all 1-digit numbers, compression rate is: 2.4285714285714284

    all 2-digit numbers, compression rate is: 38.42857142857143

    all 3-digit numbers, compression rate is: 514.1428571428571

    each 3-digit number 3 times, compression rate is: 2.3977348434377084
```
