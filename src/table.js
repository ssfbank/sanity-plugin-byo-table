import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './table.css';
import Button from 'part:@sanity/components/buttons/default';
import Preview from 'part:@sanity/base/preview'
import EditIcon from 'react-icons/lib/md/edit';
import {FormBuilderInput} from 'part:@sanity/form-builder'
import PopOver from 'part:@sanity/components/dialogs/popover';
import DialogContent from 'part:@sanity/components/dialogs/content';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc'
import DragBarsIcon from 'part:@sanity/base/bars-icon'

const DragHandle = sortableHandle(() => 
<span class={styles.dragHandle}><DragBarsIcon/></span>
);

const SortableItem = sortableElement(({value}) => (
  <div class={styles.row}>
    <DragHandle />
    {value}
  </div>
));

const Table = ({ rows, updateStringCell, onEvent, removeColumn, removeRow, tableTypes, handleSortEnd }) => {
  if (!rows || !rows.length) return null;
  const {  cellsFieldName, cellType: propCellType } = tableTypes;
  const [activeObjectEdit, setActiveObjectEdit] = useState(null);

  const cellType = {
    icon: EditIcon,
    ...propCellType
  };
  // Button to remove row
  const renderRowRemover = index => (
    <div className={styles.rowDelete}>
      <span onClick={() => removeRow(index)} />
    </div>
  );

  // Button to remove column
  const renderColumnRemover = index => (
    <div key={index} className={styles.colDelete}>
      <span onClick={() => removeColumn(index)} />
    </div>
  );

  const renderColumnRemovers = row => (
    <div class={styles.row}>{row[cellsFieldName].map((c, i) => renderColumnRemover(i))}</div>
  );


  const renderRowCell = (rowIndex) => (value, cellIndex) => {
    const isStringInput = cellType.jsonType === 'string';
    const cellStyles = isStringInput ? styles.cell : styles.objectCell;

    return (
      <div key={`cell-${cellIndex}`} className={cellStyles}>
        { isStringInput &&
          <input
          className={styles.input}
          type="text"
          value={value}
          onChange={e => updateStringCell(e.target.value, rowIndex, cellIndex)}
        />
        }
        { !isStringInput &&
          <Button className={styles.objectInput} color="white" onClick={() => setActiveObjectEdit({
            rowIndex,
            cellIndex
          })}>
            <Preview value={value} type={cellType} layout="inline" />
          </Button>
        }
      </div>
    );
  }

  const renderRow = (row, rowIndex) => {
    const renderCell = renderRowCell(rowIndex);

    const inners = (
      <>
        {row[cellsFieldName].map(renderCell)}
        {renderRowRemover(rowIndex)}
      </>
    )

    return (
      <SortableItem key={`row-${rowIndex}`} index={rowIndex} value={inners} />
    );
  };
  const SortableContainer = sortableContainer(({children}) => {
    return <div>{children}</div>;
  });

  return (
    <>
    { activeObjectEdit && (
        <PopOver
        onBlur={() => setActiveObjectEdit(null)}
        onClickOutside={() => setActiveObjectEdit(null)}
        onClose={() => setActiveObjectEdit(null)}
        >
          <DialogContent size={'large'} padding={'large'}>
            <FormBuilderInput
              type={cellType}
              value={rows[activeObjectEdit.rowIndex].cells[activeObjectEdit.cellIndex]}
              onChange={patchEvent => {
                const newEvent = [
                  activeObjectEdit.cellIndex,
                  cellsFieldName,
                  activeObjectEdit.rowIndex
                 ]
                  .reduce((prefixedEvent, pathSeg) => prefixedEvent.prefixAll(pathSeg), patchEvent)

                return onEvent(newEvent);
              }}
              onBlur={() => {}}
              onFocus={() => {}}
            />
            </DialogContent>
        </PopOver>
    )}
    {
      <div className={styles.table}>
        <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
          {rows.map(renderRow)}
          {renderColumnRemovers(rows[0])}
        </SortableContainer>
      </div>
    }

    </>
  );
};

Table.propTypes = {
  rows: PropTypes.array,
  updateCell: PropTypes.func,
  removeColumn: PropTypes.func,
  removeRow: PropTypes.func,
  tableTypes: PropTypes.object,
};

export default Table;
