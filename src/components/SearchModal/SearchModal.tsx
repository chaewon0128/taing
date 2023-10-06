import { currentTimes } from '@/utils/currentTimes';
import styles from './SearchModal.module.scss';
import { useReadData } from '@/hooks/useReadData';
import { useState } from 'react';

const SearchModal = () => {
  const popularSearches = [
    '재벌집 막내아들',
    '미스터트롯2: 새로운 전설의 시작',
    '유 퀴즈 온 더 블럭',
    '대행사',
    'SHOW ME THE MONEY 11',
    '미씽:그들이 있었다2',
    '술꾼도시여자들2',
    '캐나다 체크인',
    '미씽:그들이 있었다 - 그들을 다만나다',
    '술꾼도시여자들',
  ];

  const { data, readData } = useReadData('images');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedImgs, setSearchedImgs] = useState<(string | undefined)[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue === '') {
      setSearchedImgs([]);
      return;
    }

    await readData();

    const matchedDataArray = data.filter(
      d => d.name?.toLowerCase().includes(inputValue),
    );

    const resultImages = matchedDataArray
      .map(matchedData => {
        if (matchedData.main?.must) return matchedData.main?.must;
        if (matchedData.main?.popular) return matchedData.main?.popular;
        if (matchedData.main?.only) return matchedData.main?.only;
        return undefined;
      })
      .filter(Boolean);

    setSearchedImgs(resultImages);
  };

  return (
    <>
      <div className={styles.searchModal}>
        <form className={styles.search}>
          <input
            onChange={handleInputChange}
            placeholder="TV프로그램, 영화 제목으로 검색해보세요"
          />
          <button className={styles.searchIcon} />
        </form>
        {searchedImgs.length > 0 ? (
          searchedImgs.map((img, index) => (
            <img
              key={index}
              className={styles.searchImg}
              src={img}
              alt={`검색 결과 이미지 ${index + 1}`}
            />
          ))
        ) : (
          <div className={styles.searchList}>
            <div className={styles.recentSearches}>
              <h2>최근 검색어</h2>
              <ul>
                <li>검색 내역이 없습니다.</li>
              </ul>
            </div>
            <div className={styles.popularList}>
              <h2>실시간 인기 검색어</h2>
              <ul>
                {popularSearches.map((search, index) => (
                  <li key={index}>
                    <span>{index + 1}</span>
                    {search}
                  </li>
                ))}
              </ul>
              <div
                className={styles.currentTime}
              >{`${currentTimes()} 기준`}</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.overlay} />
    </>
  );
};

export default SearchModal;
