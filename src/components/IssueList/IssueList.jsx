import { useContext, useEffect, useRef } from 'react';
import { GithubContext } from '../../context/GithubContext';
import { IssueListItem } from '../IssueListItem/IssueListItem';
import { IssueListAd } from '../IssueListAd/IssueListAd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ErrorPage } from '../../Pages/ErrorPage';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import ScrollObserver from '../ScrollObserver/ScrollObserver';

export function IssueList() {
  const { issueList, fetchIssueList, fetchError } = useContext(GithubContext);
  const navigate = useNavigate();
  const target = useRef(null);
  const intersecting = useInfiniteScroll(target);

  useEffect(() => {
    if (intersecting) {
      fetchIssueList();
    }
  }, [intersecting]);

  if (fetchError) {
    return <ErrorPage />;
  }

  return (
    <IssueWrap>
      {issueList.map((issue, index) =>
        (index + 1) % 4 === 0 ? (
          <IssueListItem
            onClick={() => {
              navigate(`/detail/${issue.number}`);
            }}
            key={issue.id}
            issue={issue}
          >
            <IssueListAd />
          </IssueListItem>
        ) : (
          <IssueListItem
            onClick={() => {
              navigate(`/detail/${issue.number}`);
            }}
            key={issue.id}
            issue={issue}
          />
        )
      )}
      <ScrollObserver ref={target} />
    </IssueWrap>
  );
}

export const IssueWrap = styled.ul`
  list-style: none;
  width: 70%;
  margin: 0 auto;
  padding: 0;
`;
