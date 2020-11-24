export default {
    title: 'Table Cell',
    name: 'cell',
    type: 'object',
    fields: [
        {
            name: 'value',
            title: 'The value',
            type: 'string'
        },
        {
            name: 'anotherValue',
            title: 'More value',
            type: 'number'
        }
    ],
    preview: {
        select: {
            title: 'value',
            subtitle: 'anotherValue'
        }
    }
};