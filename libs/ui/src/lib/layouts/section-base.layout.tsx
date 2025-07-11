import { ScrollArea } from '@radix-ui/themes';
import './section-base.layout.css';

export interface SectionBaseLayoutProps {
  main: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const SectionBaseLayout: React.FC<SectionBaseLayoutProps> = ({ header, main, footer }) => (
  <section className="section-main-base">
    {header && <header>{header}</header>}
    <main className="min-h-full">
      <ScrollArea type="auto" scrollbars="vertical">
        {main}
      </ScrollArea>
    </main>
    {footer && <footer>{footer}</footer>}
  </section>
);

export default SectionBaseLayout;
