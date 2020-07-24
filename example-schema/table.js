import RowsInput from 'part:@ssfbank/sanity-plugin-byo-table/rows-input';

export default {
  title: 'Table',
  name: 'richTable',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title (internal)'
    },
    {
      name: 'headerRow',
      type: 'array',
      of: [
        {
          type: 'localeString',
        }
      ]
    },
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'richTableRow',
        }
      ],
      inputComponent: RowsInput
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
};
