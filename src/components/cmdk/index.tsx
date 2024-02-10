import {
  forwardRef,
  createContext,
  useMemo,
  useState,
  useContext,
} from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import styles from './builder.module.css';
//@ts-ignore
import useKeypress from 'react-use-keypress';

interface BuilderContextValue {
  page: string;
  items: any[];
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const BuilderContext = createContext<BuilderContextValue>({
  page: 'root',
  items: [],
  setPage: () => {},
});

const RootDialogContainer: React.ElementType = 'div';
type RootDialogContainerRef = React.ElementRef<typeof RootDialogContainer>;
type RootDialogContainerNativeProps = React.ComponentPropsWithoutRef<
  typeof RootDialogContainer
>;

interface RootDialogProps
  extends RootDialogContainerNativeProps,
    RadixDialog.DialogProps {
  children: React.ReactNode;
}

const Dialog = forwardRef<RootDialogContainerRef, RootDialogProps>(
  (props, _) => {
    const [open, setOpen] = useState(false);
    useKeypress('Enter', (e: KeyboardEvent) => {
      e.preventDefault();
      setOpen(true);
    });
    return (
      <RadixDialog.Root open={open} onOpenChange={setOpen}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className={styles.overlay} />
          <RadixDialog.Content>{props.children}</RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  },
);

/**-------*/

const BuilderContainer: React.ElementType = 'div';
type BuilderContainerRef = React.ElementRef<typeof BuilderContainer>;
type BuilderContainerNativeProps = React.ComponentPropsWithoutRef<
  typeof BuilderContainer
>;

interface BuilderProps extends BuilderContainerNativeProps {
  children: React.ReactNode;
  page: string;
  items: any[];
}

const Builder = forwardRef<BuilderContainerRef, BuilderProps>((props, ref) => {
  const { items, ...rest } = props;
  const [page, setPage] = useState<string>(props.page);
  const value = useMemo(
    () => ({ page, items, setPage }),
    [page, items, setPage],
  );
  return (
    <BuilderContext.Provider value={value}>
      <div ref={ref} className={styles.builder} {...rest}>
        {props.children}
      </div>
    </BuilderContext.Provider>
  );
});

/**-------*/

const SearchComponentTag: React.ElementType = 'div';
type SearchComponentRef = React.ElementRef<typeof SearchComponentTag>;
type SearchComponentNativeProps = React.ComponentPropsWithoutRef<
  typeof SearchComponentTag
>;

interface SearchComponentProps extends SearchComponentNativeProps {}

const Search = forwardRef<SearchComponentRef, SearchComponentProps>(
  (_, ref) => {
    return (
      <span ref={ref}>
        <input type='text' className={styles.input} />
      </span>
    );
  },
);

/**-------*/

interface RenderItemProps<T> {
  item: T;
  focused: number;
  setFocused: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

interface PageComponentProps<T> {
  items: T[];
  renderItem: (props: RenderItemProps<T>) => React.ReactNode;
  id: string;
}

const Page = <T,>(props: PageComponentProps<T>) => {
  const { focused, setFocused } = useFocus(props.items.length);
  const { page } = useContext(BuilderContext);
  console.log(props);
  return (
    <ul>
      {props.id === page &&
        props.items.map((item, index) => {
          return props.renderItem({ item, focused, setFocused, index });
        })}
    </ul>
  );
};

const ListItemTag: React.ElementType = 'li';
type ListItemRef = React.ElementRef<typeof ListItemTag>;
type ListItemNativeProps = React.ComponentPropsWithoutRef<typeof ListItemTag>;

export type useProps = 'browse' | 'action';
interface ListItemProps extends ListItemNativeProps {
  use: 'browse' | 'action';
  label: string;
  focused: number;
  index: number;
  setFocused: React.Dispatch<React.SetStateAction<number>>;
}

const Item = forwardRef<ListItemRef, ListItemProps>((props, ref) => {
  const { label, use, focused, setFocused, index, ...rest } = props;
  const { setPage, page } = useContext(BuilderContext);
  const handleKeyDown = () => {
    setFocused(index);
  };
  useKeypress('Enter', () => setPage('uids'));
  useKeypress('Backspace', () => setPage('root'));
  console.log(page);
  return (
    <li
      key={index}
      ref={ref}
      onKeyDown={handleKeyDown}
      tabIndex={index}
      {...rest}
      style={{ background: focused === index ? 'red' : 'transparent' }}
    >
      {label} - {use}
    </li>
  );
});

const Root = Dialog;

export { Root, Dialog, Search, Page, Item, Builder };

const useFocus = (size: number) => {
  const [focused, setFocused] = useState(0);
  useKeypress('ArrowDown', () => setFocused((prev) => (prev + 1) % size));
  useKeypress('ArrowUp', () => setFocused((prev) => (prev - 1 + size) % size));

  return useMemo(() => ({ focused, setFocused }), [focused]);
};

/**
 * const PageComponentTag: React.ElementType = 'ul';
type PageComponentRef = React.ElementRef<typeof PageComponentTag>;
type PageComponentNativeProps = React.ComponentPropsWithoutRef<
  typeof PageComponentTag
>;

interface PageComponentProps extends PageComponentNativeProps {}

const Page = forwardRef<PageComponentRef, PageComponentNativeProps>(
  (_, ref) => {
    return (
      <span ref={ref}>
        <input type="text" className={styles.input} />
      </span>
    );
  }
);
 */
