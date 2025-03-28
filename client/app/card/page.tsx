'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CardSelector from '@/app/components/ui/CardSelector';
import SearchBar from '../components/ui/SearchBar';
import SetFilterDropdown from '../components/ui/SetFilterDropDown';
import RarityFilter from '../components/ui/RarityFilter';
import ResetFilters from '../components/ui/ResetFilters';
import { matchCard } from '../utils/matchCards';
import { Card, Set } from '../types';
import FiltersWrapper from '../components/layout/FiltersWrapper';
import { mockCards } from '../data/mockCards';
import { mockSets } from '../data/mockSets';

export default function CardPage() {
  const userId = '123'; // Temporaire, à remplacer par l'ID utilisateur réel

  const [Cards, setCards] = useState<Card[]>([]);
  const [Sets, setSets] = useState<Set[]>([]);
  const [ownedCards, setOwnedCards] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  // Reset Filters
  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedSets.length > 0 ||
    selectedRarities.length > 0;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSets([]);
    setSelectedRarities([]);
  };

  const toggleCard = (
    cardId: string,
    list: string[],
    setList: (val: string[]) => void,
  ) => {
    if (list.includes(cardId)) {
      setList(list.filter((id) => id !== cardId));
    } else {
      setList([...list, cardId]);
    }
  };

  const toggleSet = (setId: string) => {
    setSelectedSets((prev) =>
      prev.includes(setId)
        ? prev.filter((id) => id !== setId)
        : [...prev, setId],
    );
  };

  const toggleRarity = (rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity],
    );
  };

  // Filter
  const setMap = Sets.reduce((acc, set) => {
    acc[set.id] = set;
    return acc;
  }, {} as Record<string, Set>);

  const filteredCards = Cards.filter(
    (card) =>
      matchCard(card, setMap[card.set_id], searchQuery) &&
      (selectedSets.length === 0 || selectedSets.includes(card.set_id)) &&
      (selectedRarities.length === 0 || selectedRarities.includes(card.rarity)),
  );

  const cardsSorted = [...filteredCards].sort(
    (a, b) => a.official_id - b.official_id,
  );

  const cardsGroupedBySet: Record<string, Card[]> = cardsSorted.reduce(
    (acc, card) => {
      if (!acc[card.set_id]) acc[card.set_id] = [];
      acc[card.set_id].push(card);
      return acc;
    },
    {} as Record<string, Card[]>,
  );

  useEffect(() => {
    setCards(mockCards);
    setSets(mockSets);
    const fetchUserData = async () => {
      try {
        // Simulation avec un délai (à remplacer par fetch réel)
        await new Promise((res) => setTimeout(res, 800));

        const mockWishlist = ['1'];
        const mockDuplicates = ['2'];

        setWishlist(mockWishlist);
        setOwnedCards(mockDuplicates);
      } catch (err) {
        console.error('Erreur lors du chargement des données utilisateur', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading)
    return (
      <div className='p-4 text-center text-gray-xl'>
        Chargement des cartes ...
      </div>
    );

  return (
    <>
      <FiltersWrapper className='my-10 md:flex gap-6'>
        <div className='w-full md:w-[600px] mx-auto md:mx-0 '>
          <SearchBar
            placeholder='Rechercher une carte...'
            onSearch={(query) => setSearchQuery(query.toLowerCase())}
          />
        </div>
        <div className='w-full md:w-auto gap-4 mt-4 md:mt-0 justify-between sm:justify-start flex '>
          <SetFilterDropdown
            selectedSets={selectedSets}
            onToggleSet={toggleSet}
          />
          <RarityFilter
            selectedRarities={selectedRarities}
            onToggleRarity={toggleRarity}
          />

          <ResetFilters
            onClick={resetAllFilters}
            disabled={!hasActiveFilters}
          />
        </div>
      </FiltersWrapper>
      <div className='w-full max-w-[1400px] mx-auto p-2 md:p-0'>
        {Sets.map((set) => {
          const cards = cardsGroupedBySet[set.id];
          if (!cards || cards.length === 0) return null;
          return (
            <section key={set.id} className='mb-12'>
              <div className='flex items-center bg-white rounded-xl p-6 shadow-base gap-3 mb-6 w-max'>
                <Image
                  src={set.img_url}
                  alt={set.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-auto h-[60px]'
                />
              </div>
              <div className='grid gap-6 justify-center grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
                {cards.map((card) => (
                  <div key={card.id} className='justify-self-center'>
                    <Image
                      src={card.img_url}
                      alt={card.name}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className=' w-[120px]
                          sm:w-[130px]
                          md:w-[150px]
                          lg:w-[170px]
                          xl:w-[190px]
                          2xl:w-[210px]
                          h-auto
                          shadow-base
                          mx-auto
                          '
                    />

                    <CardSelector
                      cardId={card.id}
                      ownedCards={ownedCards}
                      wishlist={wishlist}
                      toggleOwned={(id) =>
                        toggleCard(id, ownedCards, setOwnedCards)
                      }
                      toggleWishlist={(id) =>
                        toggleCard(id, wishlist, setWishlist)
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
