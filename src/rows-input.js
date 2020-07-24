import uuid from '@sanity/uuid';
import React from 'react';
import PropTypes from 'prop-types';
import Table from './table';
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event';
import ButtonGrid from 'part:@sanity/components/buttons/button-grid';
import Button from 'part:@sanity/components/buttons/default';

const createPatchFrom = value => {
  return PatchEvent.from(set(value));
};

class RowsInput extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string
    }).isRequired,
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
  };

  getTableTypes = () => {
    const { type } = this.props;
    if (type.jsonType !== 'array' || type.of.length !== 1) {
      throw new Error('The type using rows-input needs to be array of one subtype');
    }
    const rowTypeObject = type.of[0]
  
    if (rowTypeObject.jsonType !== 'object') {
      throw new Error('The rows-input array type has to be an object');
    }
  
    const cellsField = rowTypeObject.fields.find(field => {
      return field.type.jsonType === 'array' && field.type.of.length === 1
      && (field.type.of[0].jsonType === 'object' || field.type.of[0].jsonType === 'string')
    }); 
  
    const cellType = cellsField.type.of[0];
  
    return {
      rowTypeName: rowTypeObject.name,
      cellsFieldName: cellsField.name,
      cellType
    }
  }

  updateStringCell = (stringValue, rowIndex, cellIndex) => {
    const { value, onChange } = this.props;
    const { cellsFieldName } = this.getTableTypes();
    // Clone the current table data
    const newValue = [ ...value ];
    newValue[rowIndex][cellsFieldName][cellIndex] = stringValue;
    const patchEvent = createPatchFrom(newValue)
    return onChange(patchEvent);
  };

  propagateEvent = (event) => this.props.onChange(event)

  newCell = (cellType) => {
    const _newCell = cellType.jsonType === 'string' ? '' : {
      _type: cellType.name
    }
    return _newCell;
  }

  initializeTable = () => {
    const { onChange } = this.props;
    const { cellsFieldName, rowTypeName, cellType } = this.getTableTypes();
    // Add a single row with a single empty cell (1 row, 1 column)
    const newValue = [{ _type: [rowTypeName], _key: uuid(), [cellsFieldName]: [this.newCell(cellType)] }];
    return onChange(createPatchFrom(newValue));
  };

  addRow = e => {
    const { value, onChange } = this.props;
    const { cellsFieldName, rowTypeName, cellType } = this.getTableTypes();
    // If we have an empty table, create a new one
    if (!value) return this.initializeTable();
    // Clone the current table data
    const newValue = [ ...value ];
    // Calculate the column count from the first row
    const columnCount = value[0][cellsFieldName].length;
    // Add as many cells as we have columns
    newValue.push({
      _type: rowTypeName,
      _key: uuid(),
      cells: Array(columnCount).fill(this.newCell(cellType)),
    });
    return onChange(createPatchFrom(newValue));
  };

  removeRow = index => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = [ ...value ];
    // Remove the row via index
    newValue.splice(index, 1);
    // If the last row was removed, clear the table
    if (!newValue.length) {
      this.clear();
    }
    return onChange(createPatchFrom(newValue));
  };

  addColumn = e => {
    const { value, onChange } = this.props;
    const { cellsFieldName, cellType } = this.getTableTypes();
    // If we have an empty table, create a new one
    if (!value) return this.initializeTable();
    // Clone the current table data
    const newValue = [ ...value ];
    // Add a cell to each of the rows
    newValue.forEach((row, i) => {
      newValue[i][cellsFieldName].push(this.newCell(cellType));
    });
    return onChange(createPatchFrom(newValue));
  };

  removeColumn = index => {
    const { value, onChange } = this.props;
    const { cellsFieldName } = this.getTableTypes();
    // Clone the current table data
    const newValue = [ ...value ];
    // For each of the rows, remove the cell by index
    newValue.forEach(row => {
      row[cellsFieldName].splice(index, 1);
    });
    // If the last cell was removed, clear the table
    if (!newValue[0][cellsFieldName].length) {
      this.clear();
    }
    return onChange(createPatchFrom(newValue));
  };

  // Unsets the entire table value
  clear = () => {
    const { onChange } = this.props;
    return onChange(PatchEvent.from(unset()));
  };

  focus = () => {

  }

  render() {
    const { type, value } = this.props;
    const { title, description } = type;

    const table =
      value && value.length ? (
        <Table
          rows={value}
          updateStringCell={this.updateStringCell}
          onEvent={this.propagateEvent}
          removeColumn={this.removeColumn}
          removeRow={this.removeRow}
          tableTypes={this.getTableTypes()}
        />
      ) : null;

    const buttons = value ? (
      <ButtonGrid>
        <Button inverted onClick={this.addRow}>
          Add Row
        </Button>
        <Button inverted onClick={this.addColumn}>
          Add Column
        </Button>
        <Button inverted color="danger" onClick={this.clear}>
          Clear
        </Button>
      </ButtonGrid>
    ) : (
      <Button color="primary" onClick={this.initializeTable}>
        New Table
      </Button>
    );

    return (
      <div>
        <h3>{title}</h3>
        <h5>{description}</h5>
        {table}
        {buttons}
      </div>
    );
  }
}

export default RowsInput;