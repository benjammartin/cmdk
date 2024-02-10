import * as Builder from './components/cmdk';

const root = [
  {
    use: 'browse' as Builder.useProps,
    label: 'Demo A',
  },
  {
    use: 'browse' as Builder.useProps,
    label: 'Demo B',
  },
  {
    use: 'browse' as Builder.useProps,
    label: 'Demo C',
  },
];

const uids = [
  {
    use: 'action' as Builder.useProps,
    label: 'uids A',
  },
  {
    use: 'action' as Builder.useProps,
    label: 'uids B',
  },
  {
    use: 'action' as Builder.useProps,
    label: 'uids C',
  },
];

function App() {
  return (
    <Builder.Dialog>
      <Builder.Builder page='root' items={root}>
        <Builder.Search />
        <Builder.Page
          id='root'
          items={root}
          renderItem={({ item, focused, setFocused, index }) => (
            <Builder.Item
              key={index}
              setFocused={setFocused}
              index={index}
              label={item.label}
              use={item.use}
              focused={focused}
            />
          )}
        />
        <Builder.Page
          id='uids'
          items={uids}
          renderItem={({ item, focused, setFocused, index }) => (
            <Builder.Item
              key={index}
              setFocused={setFocused}
              index={index}
              label={item.label}
              use={item.use}
              focused={focused}
            />
          )}
        />
      </Builder.Builder>
    </Builder.Dialog>
  );
}

export default App;
