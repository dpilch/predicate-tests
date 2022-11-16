import { useEffect, useState } from 'react';
import { DataStore } from 'aws-amplify';
import { Predicates } from '@aws-amplify/datastore';
import { Task, Item } from './models';

function ItemComponent({ item }) {
  const [stringField, setStringField] = useState(item.stringField);
  const [numberField, setNumberField] = useState(item.numberField);
  const [booleanField, setBooleanField] = useState(item.booleanField);
  const save = async () => {
    await DataStore.save(Item.copyOf(item, draft => {
      draft.stringField = stringField;
      draft.numberField = parseInt(numberField);
      draft.booleanField = booleanField === 'true';
    }));
  }
  return (
    <div>
      <input value={stringField} onChange={(event) => setStringField(event.target.value)} />
      <input value={numberField} onChange={(event) => setNumberField(event.target.value)} />
      <input value={booleanField} onChange={(event) => setBooleanField(event.target.value)} />
      <button onClick={save}>Save</button>
    </div>
  );
}

function CreateItem() {
  const [stringField, setStringField] = useState('');
  const [numberField, setNumberField] = useState('');
  const [booleanField, setBooleanField] = useState('');
  const save = async () => {
    await DataStore.save(new Item({
      stringField,
      numberField: parseInt(numberField),
      booleanField: booleanField === 'true',
    }));
  }
  return (
    <div>
      <input placeholder="String" value={stringField} onChange={(event) => setStringField(event.target.value)} />
      <input placeholder="Number" value={numberField} onChange={(event) => setNumberField(event.target.value)} />
      <input placeholder="Boolean" value={booleanField} onChange={(event) => setBooleanField(event.target.value)} />
      <button onClick={save}>Save</button>
    </div>
  );

}

function App() {
  const [items, setItems] = useState([]);

  const deleteAll = async () => {
    await DataStore.delete(Item, Predicates.ALL);
  }
  
  useEffect(() => {
    DataStore.observeQuery(Item, Predicates.ALL)
      .subscribe(snapshot => {
        setItems(snapshot.items);
      });
    DataStore.observeQuery(Item, item => item.stringField.eq('foo'))
      .subscribe(snapshot => {
        console.log('string eq foo', snapshot);
      });
    DataStore.observeQuery(Item, item => item.stringField.ne('foo'))
      .subscribe(snapshot => {
        console.log('string eq foo', snapshot);
      });
    DataStore.observeQuery(Item, item => item.numberField.eq(1))
      .subscribe(snapshot => {
        console.log('number eq 1', snapshot);
      });
    DataStore.observeQuery(Item, item => item.numberField.ne(1))
      .subscribe(snapshot => {
        console.log('number ne 1', snapshot);
      });
    DataStore.observeQuery(Item, item => item.booleanField.eq(true))
      .subscribe(snapshot => {
        console.log('boolean eq true', snapshot);
      });
    DataStore.observeQuery(Item, item => item.booleanField.ne(true))
      .subscribe(snapshot => {
        console.log('boolean ne true', snapshot);
      });
    DataStore.observeQuery(Item, item => item.booleanField.eq(false))
      .subscribe(snapshot => {
        console.log('boolean eq false', snapshot);
      });
    DataStore.observeQuery(Item, item => item.booleanField.ne(false))
      .subscribe(snapshot => {
        console.log('boolean ne false', snapshot);
      });
  }, []);
     
  return (
    <div className="App">
      <button onClick={deleteAll}>Delete All</button>
      <div>Create New</div>
      <CreateItem />
      <div>Update Existing</div>
      {items.map(item => <ItemComponent key={item.id} item={item} />)}
    </div>
  );
}

export default App;
