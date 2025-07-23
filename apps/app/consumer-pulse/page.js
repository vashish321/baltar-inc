import Footer from '../components/ConsumerPulseComponent/FooterComponent/Footer';
import HeaderComponent from '../components/ConsumerPulseComponent/HeaderComponent/HeaderComponent';
import NewsSection from '../components/ConsumerPulseComponent/NewsComponent/NewsSection';
import SidebarComponent from '../components/ConsumerPulseComponent/SideBarComponent/SidebarComponent';

export default function TransacPage() {
  return (
    <>
      <HeaderComponent />
      <SidebarComponent />
      <NewsSection/>
      <Footer/>
    </>
  );
}
