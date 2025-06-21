import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTopic, markTopicsFromML, changeStack } from '@/store/slices/topicsSlice.ts';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';

interface Topic {
  id: string;
  label: string;
  level: 'A2' | 'A3';
  stack: 'react' | 'dotnet';
  checked: boolean;
}

const TopicsTab = () => {
  const dispatch = useDispatch();
  const { stack, items } = useSelector((s: RootState) => s.topics);

  const bySection = items.reduce(
    (acc, t) => {
      acc[t.section] = acc[t.section] || [];
      acc[t.section].push(t);
      return acc;
    },
    {} as Record<string, typeof items>,
  );

  return (
    <div className="space-y-4">
      <select
        value={stack}
        onChange={e => dispatch(changeStack(e.target.value as any))}
        className="bg-gray-700 text-white p-2 rounded"
      >
        <option value="react">React</option>
        <option value="dotnet">.NET</option>
        <option value="frontend">Frontend</option>
      </select>

      {Object.entries(bySection).map(([sec, list]) => (
        <div key={sec}>
          <h3 className="text-gray-400">{sec}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {list.map(t => (
              <Button
                key={t.id}
                variant="outline"
                className={`${t.checked ? 'border-blue-500 text-blue-300' : 'border-black text-gray-300'} bg-gray-800 hover:bg-gray-700`}
                onClick={() => dispatch(toggleTopic(t.id))}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <Button
        onClick={() => {
          // @ts-ignore
          dispatch(markTopicsFromML());
        }}
      >
        Авто-чек через ML
      </Button>
    </div>
  );
};

export default TopicsTab;
