function padTo2Digits(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Преобразование к формату dd/mm/yyyy
 * @param {Date} date - объект Date
 * @param {string} [separator='.'] - разделитель
 * @returns {string} - отформатированная дата
 */
export default function(date: Date, separator = '.'): string {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(separator);
}
