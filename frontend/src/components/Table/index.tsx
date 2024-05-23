import React from 'react';

interface Props {
  style: { [key: string]: any };
  data: Record<string, any>[];
  action?: {
    add?: (data: {[key: string]: any}) => void;
    edit?: (data: {[key: string]: any}) => void;
  };
  custom?: {
    [key: string]: {
      value?: string;
      render?: (value: string, item: any) => JSX.Element;
      avoid?: boolean;
    };
  };
}

const Table: React.FC<Props> = ({ data, custom = {}, action, style }) => {
  if (!data.length) return null;

  const columns = Object.keys(data[0]);

  const handlerOnAction = (item: object, func: any): void => {
    if (action && typeof func === 'function') {
      func && func(item);
    }
  }

  return (
    <table className={style.table}>
      <thead className={style.table__thead}>
        <tr className={style.table__theadTr}>
          {columns.map((column: string, index: number) => {
            const customColumn = custom[column];

            if (customColumn?.avoid == true) return null;

            return (
              <th key={index} className={style.table__theadTh}>
                {customColumn?.value || column}
              </th>
            )
          })}
          {action && (<th> Acción </th>)}
        </tr>
      </thead>
      <tbody className={style.tbody}>
        {data.map((item: any, rowIndex: number) => (
          <tr key={rowIndex} className={style.table__tbodyTr}>
            {columns.map((column, colIndex: number) => {
              const customRow = custom[column];
              const render = customRow?.render ? customRow.render(item[column], item) : item[column];

              if (customRow?.avoid == true) return null;

              return (
                <td key={colIndex} className={style.table__tbodyTd}>
                  {render}
                </td>
              )
            })}
            {action && (
              <td className={style.table__tbodyTd}>
                {action.add && <button className={style.table__actionAdd} onClick={() => handlerOnAction(item, action.add)}>Agregar</button>}
                {action.edit && <button className={style.table__actionEdit} onClick={() => handlerOnAction(item, action.edit)}>Editar</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
