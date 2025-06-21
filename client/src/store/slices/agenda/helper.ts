import { AgendaItem } from '@/store/slices/agenda/agendaSlice.ts';
import { v4 as uuidv4 } from 'uuid';

/**
 * Парсить markdown-список у вкладену структуру AgendaItem[]
 */
export function parseMarkdownAgenda(markdown: string): AgendaItem[] {
  const lines = markdown.split('\n').filter(line => line.trim() !== '');

  const root: AgendaItem[] = [];
  const stack: { level: number; items: AgendaItem[] }[] = [{ level: -1, items: root }];

  for (let line of lines) {
    const match = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (!match) continue;

    const indent = match[1].length;
    const level = Math.floor(indent / 2); // 2 пробіли = один рівень
    const text = match[2];

    const newItem: AgendaItem = {
      id: uuidv4(),
      text,
      checked: false,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].items;
    parent.push(newItem);

    stack.push({ level, items: newItem.children! });
  }

  return root;
}
