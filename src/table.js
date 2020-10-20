import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './table.css';
import Button from 'part:@sanity/components/buttons/default';
import Preview from 'part:@sanity/base/preview'
import { EditIcon } from 'react-icons/md';
import {FormBuilderInput} from 'part:@sanity/form-builder'
import PopoverDialog from 'part:@sanity/components/dialogs/popover';
import DefaultDialog from 'part:@sanity/components/dialogs/content';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc'
import DragBarsIcon from 'part:@sanity/base/bars-icon'

const DragHandle = sortableHandle(() => 
<span className={styles.dragHandle}><DragBarsIcon/></span>
);

const SortableItem = sortableElement(({value}) => (
  <div className={styles.row}>
    <DragHandle />
    {value}
  </div>
));

const Table = ({ rows, updateStringCell, onEvent, removeColumn, removeRow, tableTypes, handleSortEnd }) => {
  if (!rows || !rows.length) return null;
  const {  cellsFieldName, cellType } = tableTypes;
  const [activeObjectEdit, setActiveObjectEdit] = useState(null);

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
    <div className={styles.row}>{row[cellsFieldName].map((c, i) => renderColumnRemover(i))}</div>
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
            <Preview className={styles.objectPreview} 
            value={value} 
            type={cellType} 
            layout="inline" />
          </Button>
        }
      </div>
    );
  }

  const SortableContainer = sortableContainer(({children}) => {
    return <div>{children}</div>;
  });

  return (
    <>
    { activeObjectEdit && (
        <PopoverDialog
        onBlur={() => setActiveObjectEdit(null)}
        onClickOutside={() => setActiveObjectEdit(null)}
        onClose={() => setActiveObjectEdit(null)}
        size={'large'} padding={'large'}
        >
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
        </PopoverDialog>
    )}
    {
      <div className={styles.table}>
        <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
          {rows.map((row, rowIndex) => {
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
        })}
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
