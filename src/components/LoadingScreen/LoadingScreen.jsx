import { useContext } from 'react';
import { GithubContext } from '../../context/GithubContext';
import { Background, LoadingText, Wrap } from './LoadingScreen.styled';
import Spinner from '../../assets/spinner.gif';

const LoadingScreen = () => {
  const { isLoading } = useContext(GithubContext);
  console.log(isLoading, 'isLoading 이벤트 발생');

  return (
    <>
      {isLoading && (
        <Wrap>
          <Background>
            <LoadingText>잠시만 기다려 주세요.</LoadingText>
            <img src={Spinner} alt="로딩중" width="5%" />
          </Background>
        </Wrap>
      )}
    </>
  );
};

export default LoadingScreen;
