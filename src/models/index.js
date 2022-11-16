// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Task, Item } = initSchema(schema);

export {
  Task,
  Item
};