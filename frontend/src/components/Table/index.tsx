import React from 'react';
import defaultStyle from './style.module.sass';
import { getClassName } from '../../tools/function';
import { Custom } from './type';

interface Props {
  style: { [key: string]: any };
  data: Record<string, any>[];
  custom?: { [key: string]: Custom };
};

const Table: React.FC<Props> = ({ data, custom = {}, style }): JSX.Element | null => {
  if (!data.length) return null;

  const columns: string[] = Object.keys(data[0]);

  return (
    <table className={getClassName(defaultStyle.table, style.table)}>

      <thead className={getClassName(defaultStyle.table__thead, style.table__thead)}>
        <tr className={getClassName(defaultStyle.table__tr, style.table__theadTr)}>
          {columns.map((column: string, index: number): JSX.Element | null => {
            const customColumn: Custom = custom[column];

            if (customColumn?.avoid == true) return null;

            return (
              <th
                scope="col"
                key={index}
                className={getClassName(defaultStyle.table__th, style.table__tbodyTh)}
              >
                {customColumn?.value || column}
              </th>
            )
          })}
        </tr>
      </thead>

      <tbody className={style.tbody}>
        {data.map((item: any, rowIndex: number) => (
          <tr key={rowIndex} className={getClassName(style.table__tbodyTr, defaultStyle.table__tr)}>
            {columns.map((column, colIndex: number): JSX.Element | null => {
              const customRow: Custom = custom[column];
              const render: JSX.Element | string = customRow?.render ? customRow.render(item[column], item) : item[column];

              if (customRow?.avoid == true) return null;

              return (
                <td
                  data-label={customRow?.value || column}
                  key={colIndex}
                  className={getClassName(defaultStyle.table__td, style.table__tbodyTd)}
                >
                  {render}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
