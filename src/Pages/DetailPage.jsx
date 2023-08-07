import { useParams } from 'react-router-dom';
import { GithubContext } from '../context/GithubContext';
import { useContext, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import moment from 'moment';
import { ErrorPage } from './ErrorPage';
import { IssueDetail } from '../components/IssueDetail/IssueDetail';

function DetailPage() {
  const { number } = useParams();
  const { issue, fetchIssue, fetchError } = useContext(GithubContext);

  useEffect(() => {
    if (number) {
      const detailNumber = parseInt(number);
      fetchIssue(detailNumber);
    }
  }, []);

  if (fetchError) {
    return <ErrorPage />;
  }

  return (
    <>
      <IssueDetail issue={issue} />
    </>
  );
}

export default DetailPage;
