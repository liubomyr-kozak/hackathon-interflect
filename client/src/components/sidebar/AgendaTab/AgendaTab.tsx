import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store/store.ts';
import {
  setItemsFromText,
  toggleItem,
  setIsEditing,
  AgendaItem,
  bulkToggleChecked,
} from '@/store/slices/agenda/agendaSlice.ts';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { updateCheckedFromLLM } from '@/store/slices/agenda/agendaSlice.action.ts';

const AgendaCheckboxItem = ({ item, level = 0 }: { item: AgendaItem; level?: number }) => {
  const dispatch = useDispatch();

  return (
    <div style={{ marginLeft: level * 16 }}>
      <label className="flex items-center space-x-2 text-white">
        <Checkbox checked={item.checked} onCheckedChange={() => dispatch(toggleItem(item.id))} />
        <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.text}</span>
      </label>
      {item.children?.map(child => (
        <AgendaCheckboxItem key={child.id} item={child} level={level + 1} />
      ))}
    </div>
  );
};

const AgendaTab = () => {
  const dispatch = useDispatch();
  const { items, isEditing } = useSelector((state: RootState) => state.agenda);

  const [draftText, setDraftText] = useState(() => items.map(item => item.text).join('\n'));

  const handleSave = () => {
    dispatch(setItemsFromText(draftText));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        Outline the structure and timeline for this interview.
      </p>

      {isEditing ? (
        <>
          <Textarea
            className="min-h-[200px] bg-gray-700 border-gray-600 text-white"
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            placeholder={`представитись\nсказати за запис\nперевірити англ\nінтерв'ю\nкод сесія`}
          />
          <Button onClick={handleSave}>Зберегти</Button>
        </>
      ) : (
        <>
          {items.map(item => (
            <AgendaCheckboxItem key={item.id} item={item} />
          ))}
          <Button variant="secondary" onClick={() => dispatch(setIsEditing(true))}>
            Редагувати
          </Button>
        </>
      )}

      <br />
      <Button
        onClick={() => {
          //@ts-ignore
          dispatch(updateCheckedFromLLM(items)).then(res => {
            if (res.payload) dispatch(bulkToggleChecked(res.payload));
          });
        }}
      >
        Авто-чекнути (LLM)
      </Button>
    </div>
  );
};

export default AgendaTab;
