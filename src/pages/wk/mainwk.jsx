import { Routes, Route } from 'react-router-dom';
import WHero from './whero';
import SubNavWK from './SubNavWK';
import DeskripsiWK from './deskripsiwk';
import WilayahKerja from './wilayahkerja';
import HargaMinyak from './HargaMinyak';

const WilayahKerjaMain = () => (
  <>
    <DeskripsiWK />
    <WilayahKerja />
  </>
);

const Mainwk = () => {
  return (
    <div className="min-h-screen bg-white">
      <WHero />
      <SubNavWK />
      <Routes>
        <Route index element={<WilayahKerjaMain />} />
        <Route path="harga-minyak" element={<HargaMinyak />} />
      </Routes>
    </div>
  );
};

export default Mainwk;