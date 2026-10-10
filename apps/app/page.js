import AppleHomePage from './components/AppleHomePage/AppleHomePage';

export const metadata = {
  title: 'Baltar Inc. | One Company. Limitless Services.',
  description:
    'Baltar Inc is a Canadian multi-division firm operating across technology, hospitality, fashion, and consultancy. Serving businesses and clients across Toronto and the GTA.',
  keywords: [
    'Baltar Inc',
    'Toronto business',
    'Canadian technology company',
    'web design Toronto',
    'event catering Toronto',
    'luxury eyewear Canada',
    'engineering consulting Toronto',
  ],
};

export default function Home() {
  return <AppleHomePage />;
}
