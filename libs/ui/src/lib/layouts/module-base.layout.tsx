import './module-base.layout.css';

export interface ModuleBaseLayoutProps {
  main: React.ReactNode;
  aside?: React.ReactNode;
  article?: React.ReactNode;
}

export const ModuleBaseLayout: React.FC<ModuleBaseLayoutProps> = ({
  aside,
  main,
  article,
}) => (
  <section className="features-base">
    {aside && <aside>{aside}</aside>}
    <main>{main}</main>
    {article && <article>{article}</article>}
  </section>
);

export default ModuleBaseLayout;
