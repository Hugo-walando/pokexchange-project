'use client';

import { useState } from 'react';
import LeftColumn from './components/home/LeftColumn';
import RightColumn from './components/home/RightColumn';
import { ListedCard } from './types';
import useIsMobile from './hooks/useIsMobile';
import QuickTradeDetails from './components/home/QuickTradeDetails';
import MatchList from './components/home/MatchList';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<ListedCard | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'matchs'>('default');
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile : bouton pour changer de mode */}
      {isMobile && viewMode === 'default' && (
        <button
          onClick={() => setViewMode('matchs')}
          className='fixed top-8 right-0 z-50 bg-white text-gray-lg px-4 py-2 rounded-l-full shadow-lg md:hidden flex items-center'
        >
          Voir les matchs
          <ChevronRight className='w-6 h-6 ml-2' />
        </button>
      )}

      <div className='flex gap-6'>
        {/* 🟢 LeftColumn visible dans tous les cas */}
        {viewMode === 'default' && <LeftColumn onCardClick={setSelectedCard} />}

        {/* 🟦 RightColumn (matchs ou détails) sur desktop */}
        {!isMobile && (
          <RightColumn
            selectedCard={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </div>

      {/* 📱 Mobile : détails plein écran */}
      {isMobile && selectedCard && (
        <div className='fixed inset-0 bg-white z-50 p-4 overflow-y-auto'>
          <button
            onClick={() => setSelectedCard(null)}
            className='absolute top-4 right-0 text-darkgray text-xl'
          >
            ✕
          </button>
          <QuickTradeDetails
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        </div>
      )}

      {/* 📱 Mobile : matchs en plein écran */}
      {isMobile && viewMode === 'matchs' && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <button
            onClick={() =>
              setViewMode(viewMode === 'matchs' ? 'default' : 'matchs')
            }
            className='fixed top-8 left-0 z-50 bg-white text-gray-lg px-4 py-2 rounded-r-full shadow-lg md:hidden flex items-center'
          >
            <ChevronLeft className='w-6 h-6 mr-2' />
            Retour aux cartes
          </button>
          <MatchList />
        </div>
      )}
    </>
  );
}
