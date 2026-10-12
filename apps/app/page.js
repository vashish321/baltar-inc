import AppleHomePage from './components/AppleHomePage/AppleHomePage';
import MetaFooter from './components/MetaStyleComponents/MetaFooter';

export const metadata = {
  title: 'Baltar Inc — One Company. Limitless Services. | Canada',
  description:
    'Baltar Inc is a Canadian multi-division firm operating across technology, hospitality, fashion, and consultancy.',
  alternates: { canonical: 'https://baltar.ca' },
};

export default function Home() {
  return (
    <>
      <AppleHomePage />
      <MetaFooter />
    </>
  );
}
