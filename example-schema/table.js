import RowsInput from 'part:@ssfbank/sanity-plugin-byo-table/rows-input';

export default {
  title: 'Table',
  name: 'table',
  type: 'object',
  fields: [
    {
      name: 'whatever',
      title: 'Whatever field you fancy',
      type: 'string'
    },
    {
      name: 'rows',
      type: 'array',
      of: [
        {
          type: 'tableRow',
        }
      ],
      inputComponent: RowsInput
    }
  ]
};
