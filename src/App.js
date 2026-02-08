import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GenericPage from './pages/GenericPage';
import Strains from './pages/Strains';
import CannabisTools from './pages/CannabisTools';
import FlavorTreeExplorer from './pages/FlavorTreeExplorer';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/strains" element={<Strains />} />
        <Route path="/tree" element={<GenericPage title="Tree" />} />
        <Route path="/growers" element={<GenericPage title="Growers" />} />
        <Route path="/breeders" element={<GenericPage title="Breeders" />} />
        <Route path="/people" element={<GenericPage title="People" />} />
        <Route path="/tools" element={<CannabisTools />} />
        <Route path="/tools/flavor-tree" element={<FlavorTreeExplorer />} />
      </Routes>
    </Layout>
  );
}