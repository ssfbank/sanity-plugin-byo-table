# sanity-plugin-byo-table

[Sanity](https://www.sanity.io/) plugin that supplies the react editor for a user defined table and row. Basically, bring your own schema.

This repo is forked from [sanity-plugin-table](https://www.github.com/rdunk/sanity-plugin-table)

## Installing

Install using the [Sanity CLI](https://www.sanity.io/docs/cli).

```
sanity install @ssfbank/sanity-plugin-byo-table
```

## Usage

You need to define the schema types yourself and refer to this plugin as an input component there:

```javascript
import RowsInput from 'part:@ssfbank/sanity-plugin-byo-table/rows-input';

export default {
  title: 'Table',
  name: 'table',
  type: 'object',
  fields: [
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
```

You can use both strings and sanity objects as cell value. 
There are no restrictions on the naming of the schema types involved, but 'rows' need to be an array of the row object, and the row object needs to only have one field of type array.

To ease implementation you should probably just copy-paste the contents of /example-schema into your sanity repo /schema/whatever-table. Then declare those table components like you usually would.
The examples are not totally complete.

## Migrating from sanity-plugin-table

If coming from the original fork and wanting to switch to this plugin,
you can do it without migrating. Just install this plugin, remove the old one, copy in the schema and point the RowsInput-component to the 'rows' field.

## License

[MIT](http://opensource.org/licenses/MIT)
