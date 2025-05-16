import React, { useEffect, useState } from 'react';
import './App.css';

import { Sidebar } from './component/side-bar';
import { DeviceGrid } from './component/device-grid';
import { Settings } from './component/settings';
import { Dashboard } from './component/dashboard';
import { PipelineDetailsWrapper } from './component/pipeline-board';
import { useBoardStore } from './utils/board-store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

function App() {
  const fetchGitLabData = useBoardStore((s) => s.fetchGitLabData);
  const fetchBoards = useBoardStore((s) => s.fetchBoards);

  useEffect(() => {
    fetchGitLabData();
    fetchBoards();
  }, [fetchGitLabData, fetchBoards]);

  return (
    <MemoryRouter>
      <div className='flex flex-col h-screen'>
        <div className='flex-1 flex flex-row min-h-0'>
          <Sidebar />
          <div className='flex-1 flex min-h-0'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/board' element={<DeviceGrid rows={3} columns={5} />} />
              <Route path='/Settings' element={<Settings />} />
              <Route path='/pipelines' element={<PipelineDetailsWrapper />} />
            </Routes>
          </div>
        </div>
      </div>
    </MemoryRouter>
  );
}

export default App;
