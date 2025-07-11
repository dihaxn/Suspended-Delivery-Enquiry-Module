export interface ChildrenProp {
  children?: React.ReactNode;
}

export interface CommonProps extends ChildrenProp {
  className?: string;
  style?: React.CSSProperties;
}

export interface ReadOnlyProps extends ChildrenProp {
  readOnly: boolean;
  setReadOnly?: (readOnly: boolean) => void;
  section?: string;
}
