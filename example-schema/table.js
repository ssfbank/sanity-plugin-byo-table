import RowsInput from 'part:@ssfbank/sanity-plugin-byo-table/rows-input';

export default {
  title: 'Table',
  name: 'table',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'totallyUnrelatedData',
      type: 'array',
      description: 'Table related data not involved in the plugin.',
      of: [
        {
          type: 'string',
        }
      ]
    },
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'row',
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
