import safeGet from 'lodash/get';

export default {
    title: 'Table Cell',
    name: 'richTableCell',
    type: 'object',
    fields: [
        {
            name: 'value',
            type: 'localeString'
        },
        {
            name: 'linkUnion',
            title: 'Link (optional)',
            type: 'reference',
            to: [
                { type: 'link' }
            ]
        }
    ],
    preview: {
        select: {
            value: 'value'
        },
        prepare(selection) {
            const txt = safeGet(selection, 'value.nn') || safeGet(selection, 'value.en') || '<Empty>';
            return {
                title: txt
            }
        }
    }
  };
  