export default {
  title: 'Table Row',
  name: 'row',
  type: 'object',
  fields: [
    {
        name: 'cells',
        type: 'array',
        of: [{ type: 'cell' }]
    }
  ]
};
