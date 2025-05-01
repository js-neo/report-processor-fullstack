// packages/shared/src/utils/idGenerator.ts

import { transliterate } from "transliteration";
type TransliterationMap = { [key: string]: string };

export const generateBaseId_transliterate = (input: string): string => {
    const transliterated = transliterate(input, {
        replace: [
            [/\s+/g, '_'],    // Пробелы → _
            [/-/g, '_'],      // Дефисы → _
            [/[^\w\s-]/gi, '_'] // Все не-буквенно-цифровые → _
        ],
        ignore: []
    });

    return transliterated
        .toLowerCase()
        .replace(/_{2,}/g, '_')  // Множественные _ → один
        .replace(/(^_|_$)/g, ''); // Обрезаем _ по краям
};

export const getUniqueId = async (
    baseId: string,
    model: any,
    field: string
): Promise<string> => {
    let counter = 1;
    let candidateId = baseId;

    while (true) {
        const exists = await model.exists({ [field]: candidateId }).exec();
        if (!exists) return candidateId;
        candidateId = `${baseId}_${counter++}`;
        if (counter > 100) throw new Error('ID generation limit exceeded');
    }
};

const transliterationMap: TransliterationMap = {
    // Кириллица
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',

    // Латиница (для case-insensitive)
    'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f',
    'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l',
    'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r',
    's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
    'y': 'y', 'z': 'z',

    // Спецсимволы
    ' ': '_', '_': '_', '-': '_',
    ',': '_', '.': '_', '!': '_', '?': '_',
    '(': '_', ')': '_', '[': '_', ']': '_',
    '{': '_', '}': '_', '<': '_', '>': '_'
};

export const generateBaseId = (input: string): string => {
    return input
        .toLowerCase()
        .split('')
        .map(char => {
            // Если символ кириллический — оставляем как есть для маппинга
            if (/[\u0400-\u04FF]/.test(char)) {
                return transliterationMap[char] || char;
            }
            // Латиница: удаляем диакритики
            const normalizedChar = char
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '');
            return transliterationMap[normalizedChar] || char;
        })
        .join('')
        .replace(/[^a-z0-9_]/g, '_') // Фильтр оставшихся невалидных символов
        .replace(/_{2,}/g, '_')      // Убираем дубли подчеркиваний
        .replace(/(^_|_$)/g, '');    // Убираем подчеркивания по краям
};


